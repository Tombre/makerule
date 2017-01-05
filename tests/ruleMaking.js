import test from 'tape';
import makeRule from '../src/index';
import * as tests from '../src/tests';
import Validator from '../src/validator' ;

test('Test makeRule chaining', t => {

	// test for
	t.doesNotThrow(makeRule.rule, 'makeRule throws exception');
		
	// make sure make rule returns all standard tests
	let testKeys = Object.keys(tests).concat(['testWith', 'mapValue', 'required']);
	let validator = makeRule.rule();
	
	for (let i = 0; i < testKeys.length; i++) {
		t.equal(typeof validator[testKeys[i]], 'function' , `The test ${testKeys[i]} from makeRule() is not a function`);
		t.doesNotThrow(validator[testKeys[i]], `The test ${testKeys[i]}() after makeRule() throws an error`);
		t.equal(typeof validator[testKeys[i]](), 'function' , `The test ${testKeys[i]} from makeRule does not return a function`);
		t.equal(typeof validator[testKeys[i]]()[testKeys[0]], 'function' , `The test ${testKeys[i]} from makeRule does not return a function which has a sub property`);
	}

	t.end();

});

test('Test makeRule outcomes', t => {


	let rule1 = makeRule.rule().isString().isEmail().longerThan(10);

	t.doesNotThrow(rule1, 'The validator does not throw');
	t.equal(typeof rule1('test'), 'object', 'The result of a validation is not an object');

	t.ok(rule1('test@gmail.com').result, 'The result prop of the correctly validated value is not true');
	t.notOk(rule1('test@gmail').result, 'The result prop of the incorrectly validated value is not false');
	t.equal(rule1('test@gmail').test, 'isEmail', 'The test prop of the incorrectly validated value is not correct');
	t.equal(rule1(1).test, 'isString', 'The name prop of the incorrectly validated value is not correct (number)');
	t.notOk(rule1('t@g.com').result, 'The result prop of the incorrectly validated value is not false (bad email)');
	t.equal(rule1('t@g.com').test, 'longerThan', 'The name prop of the incorrectly validated test is not correct (bad email)');

	// mapping

	let rule2 = makeRule.rule().isString().mapValue(value => parseInt(value, 10)).greaterThan(5);

	t.ok(rule2('6').result, 'The map value mapped correct for a valid test');
	t.notOk(rule2('2').result, 'The map value mapped correct for an invalid test');
	t.equal(rule2('2').test, 'greaterThan', 'The map value mapped correct for a valid test');
	t.equal(rule2('6').value, 6, 'The test prop of the incorrectly validated value is not correct');

	// Mutation

	let value = ['1', '2']; 
	let rule3 = makeRule.rule().mapValue(v => {
		t.ok(v === value, 'The chain does not mutate the value');
		return v;
	});
	rule3(value);

	t.end();

});

test('Test makeRule treatment ', t => {

	let rule1 = makeRule.rule();
	let rule2 = rule1.isString();

	t.notEqual(rule1, rule1.isString(), 'makeRule returns same function in chained call');
	t.notEqual(rule2, rule2.isEmail(), 'makeRule returns same function in 2 chained call');

	let rule3 = rule2.bind(this, 'hello');

	t.doesNotThrow(rule3, 'makeRule throws when this value is changed');
	t.ok(rule3().result, 'makeRule fails incorrectly when this value is changed');

	let rule4 = makeRule.rule().isString().longerThan(5).bind(t);

	t.notOk(rule4('123').result, 'makeRule passes incorrectly when this value is changed');
	

	t.end();

});

test('Testing required rules', t => {

	var rule = makeRule.rule().isString();

	t.deepEqual(rule(undefined), { result: true, value: undefined }, 'undefined value should pass through');  
	var ruleRequired = rule.required();
	t.deepEqual(ruleRequired(undefined), { result: false, test: 'required', value: undefined });

	t.end();

});

test('Testing testWith functionality', t => {

	var testForHiwithFunction = makeRule.rule().isString().testWith('hasHi', value => (value.indexOf('hi') >= 0));
	var testForHiWithRegExp = makeRule.rule().isString().testWith('hasHi', /hi/);

	t.deepEqual(testForHiwithFunction('hi there'), { result: true, value: 'hi there' });
	t.deepEqual(testForHiWithRegExp('hi there'), { result: true, value: 'hi there' });

	t.end();

});

test('Testing mapTest functionality', t => {

	var mapTest = makeRule.rule().isString().mapValue(value => parseInt(value, 10)).isNumber();
	t.deepEquals(mapTest('10'), { result: true, value: 10 });

	t.end();

});

test('validateWith outcomes', t => {

	let validator = makeRule.rule().isString().isEmail().longerThan(10);
	let rule = makeRule.validateWith(validator, { isEmail: 'bad email', longerThan: 'bad length'}, 'default');

	t.equal(rule('notemail').message, 'bad email', 'validateWith messasge not correct');
	t.equal(rule(10).message, 'default', 'validateWith message default not correct');
	t.equal(rule('test@test.com').message, undefined, 'validateWith when true incorrectly returns message');

	t.end();

});

test('validation composition', t => {

	let assignedTests = Object.assign({}, tests, { autoFail : value => false });

	let validation = Validator(assignedTests);
	let rule = validation.rule().autoFail();

	t.equal(typeof validation, 'object', 'composed validatior does not return an object');
	t.equal(typeof validation.rule, 'function', 'composed validatior makerule does not return an function');

	t.equal(typeof validation.rule, 'function', 'composed validatior makerule does not return an function');

	t.equal(rule(10).result, false, 'cust test should work correctly');

	t.end();

});

