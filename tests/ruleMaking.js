import test from 'tape';
import isValid from '../src/index';
import * as tests from '../src/tests';

test('Test makeRule chaining', t => {

	// test for
	t.doesNotThrow(isValid.makeRule, 'makeRule throws exception');
		
	// make sure make rule returns all standard tests
	let testKeys = Object.keys(tests).concat(['testWith', 'mapValue', 'required']);
	let validator = isValid.makeRule();
	
	for (let i = 0; i < testKeys.length; i++) {
		t.equal(typeof validator[testKeys[i]], 'function' , `The test ${testKeys[i]} from makeRule() is not a function`);
		t.doesNotThrow(validator[testKeys[i]], `The test ${testKeys[i]}() after makeRule() throws an error`);
		t.equal(typeof validator[testKeys[i]](), 'function' , `The test ${testKeys[i]} from makeRule does not return a function`);
		t.equal(typeof validator[testKeys[i]]()[testKeys[0]], 'function' , `The test ${testKeys[i]} from makeRule does not return a function which has a sub property`);
	}

	t.end();

});

test('Test makeRule outcomes', t => {


	let validator = isValid.makeRule().isString().isEmail().longerThen(6);

	t.doesNotThrow(validator, 'The validator does not throw');
	t.equal(typeof validator('test'), 'object', 'The result of a validation is not an object');

	t.comment(JSON.stringify(validator('test')));

	t.ok(validator('test@gmail.com').result, 'The result prop of the correctly validated value is not true');
	t.notOk(validator('test@gmail').result, 'The result prop of the incorrectly validated value is not false');
	t.equal(validator('test@gmail').test, 'isEmail', 'The test prop of the incorrectly validated value is not correct');
	t.equal(validator(1).test, 'isString', 'The name prop of the incorrectly validated value is not correct (number)');

	t.end();

});