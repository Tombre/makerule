# makeRule

A simple and functional validation library for creating custom validation rules.

## Installation

```
npm install makerule
```

The makeRule package comes with a minified version that can be added to the browser:

```html
<script type="text/javascript" src="node_modules/makerule/dist/makeRule.min.js"></script>
```

## Usage

makeRule allows you to create chainable function that can be used to test values.

```javascript
import makeRule from 'makeRule';

// functions evaluate in order from left to right
var rule = makerule.rule().isString().isAlphanumeric().longerThen(5);

rule(3); // =>  { result: false, value: 3, test: 'isString' }
rule('nope'); // =>  { result: false, value: 'nope', test: 'longerThen' }
rule('123456'); // =>  { result: true, value: '123456' }

// Because rules are functional and chainable, you can extend them as you go.
var newRule = rule.lessThen(10);
rule('a string longer then 10 characters'); // =>  { result: false, value: 'a string longer then 10 characters', test: 'lessThen' }
```

The result will return true if the value you pass to the rule is `null` or `undefined`. If the test requires a value, add `.required()` to the chain:

```javascript
var rule = makerule.rule().isString();
rule(undefined); // => { result: true, value: undefined }

var ruleRequired = rule.required();
rule(undefined); // => { result: false, test: required, value: undefined }
```

You can also write your own tests. To do this, add `.testWith()` to the chain and pass the name of the test, and a predicate function or a regular expression. That function will recieve the current value as an argument. Return a boolean true or false to describe if the test passed or failed.

```javascript
var testForHiwithFunction = makerule.rule().isString().testWith('hasHi', value => (value.indexOf('hi') >= 0));

var testForHiWithRegExp = makerule.rule().isString().testWith('hasHi', /hi/);

testForHiwithFunction('hi there'); // => { result: true, value: 'hi there' }
testForHiWithRegExp('hi there'); // => { result: true, value: 'hi there' }
``` 

If you want to change the value as it passes through the tests, you can use `.mapValue()` and pass a function which should return another value. The value that you return will then be one used for the following tests in the chain.

```javascript
// value will mapped to an integer before the isNumber test runs.
var mapTest = makerule.rule().isString().mapValue(value => parseInt(value, 10).isNumber());
mapTest('10'); // => { result: true, value: 10 }
```

### Using for validation

Most of the time when validating values, you will probably want to get some kind of error message out of it. The `validateWith()` helper function allows you to return error messages from failed tests within the result:
```javascript
// make a test for passwords. testPasswordStrength would be a function which returns true if the password is strong.
var passwordRule = makeRule.rule()..isAlphanumeric().longerThen(6).testWith('passwordStrength', testPasswordStrength);

// the last argument is the default error message
var testPassword = makeRule.validateWith(passwordRule, { 
	isAlphanumeric : 'Your password cannot contain any special characters',
	longerThen: 'Your password must be longer then 6 characters',
	passwordStrength: 'Your password should contain at least one number and one capital letter'
});

testPassword('bad'); // => { result: false, value: 'bad', test: 'longerThen', message: 'Your password must be longer then 6 characters' }
testPassword('Areallyg00dp@ssw0rd'); // => { result: true, value: 'Areallyg00dp@ssw0rd' }
```

## API

### Making Rules

- **rule()** - Creates a test function that you can chain together to create more complex tests. Returns a result object.
- **validateWith(rule, messageMap [, defaultMessage])** Returns a result object with an additional `message` perameter. The `message` perameter is equal to value of the test name that you have passed to `messageMap`. If the test name does not exist, the `defaultMessage` will be returned (or `undefined` if none is passed).

## The Result Object

The result object comprises of a `result`, `value`and `test` (if the test has failed):

```javascript
{
	result // Boolean. Evaluates as "true" or "false" depending  on the outcome of the test
	value // The value that is returned from the tests. This can be different from the original value if you have used the mapValue method to change the value mid way through validation.
	test // String (optional). If the result is false, this will be the name of the test that failed.
}
```

### General Tests

General: 

- **equals(comparison)** - Performs an `===` equality check between the value being tested and a `comparison` value.

Types:

- **isString()** - Tests if the value is a string
- **isObject()** - Tests if the value is an object (and not an Array or Null). Note that functions are objects, so passing a function as the value will pass for this test.
- **isArray()** - Tests if the value is an Array.
- **isBool()** - Tests if the value is a Boolean
- **isNumber()** - Tests if the value is a real number (not NaN)
- **isInt()** - Tests if the value is an number and integer (does not have a decimal)
- **isFloat()** - Tests if the value is a number and a float (has a decimal)

Strings:

- **isEmail()** - Test if the value is an email
- **isCreditCard()** -  Check if the value string is a credit card
- **isDateString()** - Check if the value is a date formatted like xx/yy/zz
- **isAlpha()** - Check if the calue string contains only letters (a-zA-Z)
- **isAlphanumeric()** - Check if the value contains only letters and numbers
- **isDecimalString()** - Check if the value (string) represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
- **isNumeric()** - Check if the value contains only numbers
- **isHexColor()** - Check if the value is a hex colour.
- **isURL()** - Check if the value is a URL

__These tests are from the string validation library [validator.js](https://github.com/chriso/validator.js). Refer to that for more information.__

String/Array:

- **longerThen(n)** - Test if the value is longer then than `n`. Compares with the .length property or the value.
- **shorterThen(n)** - Test if the value is shorter then than `n`. Compares with the .length property or the value.

Number:

- **divisableBy(n)** - Check if the value is divisable by `n`.
- **greaterThen(n)** - Check if the value is greater then `n`.
- **lessThen(n)** - Check if the value is less then n.

Bool:

- **isTrue()** - Check if the value is true. This is a strict === test.
- **isFalse()** - Check if the value is false. This is a strict === test.

Object/Array:

- **contains([object, array, string])** - Tests if the value (as an object or array) contains `n`. If the value being tested is an array, `n` may be a string or array of things the value should contain. If  the value is an object,   `n` can be an object map that will be compared to the value.
- **isSame([object, array])** - Tests if the value (as an object or array) is the same as `n`. This is a recursive deep comparison.

### Helper tests

- **testWith(testName, [fn, regexp])** - Tests a value using a predicate function or regular expression. If you pass a function, that function will recieve the current value as the first arguement and must return true or false. If you pass a regular expression, the value will be tested against that regular expression.
- **mapValue(fn)** - Changes the value being tested at that point in the chain where `fn` is a function the recieves the current value as the first arguemnt and returns another value.
- **required()** - Tests that the value is not `undefined` or `Null`. If you do not add `required()` to the chain, values will pass through un-tested.
 
## Custom tests setup

Testing using the provided test library might be enough for you, but if you want to save some kb or use your own testing library, makeRule allows you to imprort its validation functionality seperatly to its testing library.

To setup your own testing suite, only require/import the `validator` function. You can then pass an object map of all the your tests, where the key is the name of the test, and the test is a function that recieves the`value` as an argument, and returns true or false. Testing functions recieve the `value` as their **last argument** meaning you can use other arguments that are passed in when creating the test.

Custom validators still recieve the standard helper functions `testWith`, `mapValue`, and `required`.

```javascript

import Validator from 'makerule/validator' ;

// create a test map
var testMap = {
	isGreaterThen5 : value => (value >= 5),
	containsString: (str, value) => (value.indexOf(str) >= 0) // accepts an extra str argument
};

var validation = Validator(testMap);

var rule1 = validation.rule().required().isGreaterThen5();
var rule2 = validation.rule().containsString('awesome');

rule1(10) // => { result: true, value: 5 }
rule2('this is awesome') // => { result: true, value: 'this is awesome' }

```

The full test library is also available seperatly.

```javascript
import Validator from 'makerule/validator' ;
import * as tests from 'makerule/tests' ;

// we can add some custom tests
tests.containsString = (str, value) => (value.indexOf(str) >= 0);

// we can now use our custom tests as well as the tests in the test library
var validation = Validator(tests);
```

## A note on performace

While I haven't fully tested performance for this library, it is generally better to create your rules outside of any intensive looping or recursive code if you can avoid it. 

```javascript
	// This might be slow:
	var rules = [];
	while (rules.length < 100) {
		rules.push(makeRule.rule().isNumber().greaterThen(6));
	}

	// This is fast:
	var rule = makeRule.rule().isNumber().greaterThen(6);
	var results = [];
	while (results.length < 100) {
		results.push(rule(results.length));
	}
```

Running your tests however is optimised and usually extremely fast.

## Tests

```
npm test
```
