import test from 'tape';
import makeRule from '../src/index';
import * as tests from '../src/tests';

test('Test makeRule chaining', t => {

	// test for
	t.doesNotThrow(makeRule.makeRule, 'makeRule throws exception');
		
	// make sure make rule returns all standard tests
	let testKeys = Object.keys(tests).concat(['testWith', 'mapValue', 'required']);
	let validator = makeRule.makeRule();
	
	for (let i = 0; i < testKeys.length; i++) {
		t.equal(typeof validator[testKeys[i]], 'function' , `The test ${testKeys[i]} from makeRule() is not a function`);
		t.doesNotThrow(validator[testKeys[i]], `The test ${testKeys[i]}() after makeRule() throws an error`);
		t.equal(typeof validator[testKeys[i]](), 'function' , `The test ${testKeys[i]} from makeRule does not return a function`);
		t.equal(typeof validator[testKeys[i]]()[testKeys[0]], 'function' , `The test ${testKeys[i]} from makeRule does not return a function which has a sub property`);
	}

	t.end();

});

test('Test makeRule outcomes', t => {


	let rule1 = makeRule.makeRule().isString().isEmail().longerThen(10);

	t.doesNotThrow(rule1, 'The validator does not throw');
	t.equal(typeof rule1('test'), 'object', 'The result of a validation is not an object');

	t.ok(rule1('test@gmail.com').result, 'The result prop of the correctly validated value is not true');
	t.notOk(rule1('test@gmail').result, 'The result prop of the incorrectly validated value is not false');
	t.equal(rule1('test@gmail').test, 'isEmail', 'The test prop of the incorrectly validated value is not correct');
	t.equal(rule1(1).test, 'isString', 'The name prop of the incorrectly validated value is not correct (number)');
	t.notOk(rule1('t@g.com').result, 'The result prop of the incorrectly validated value is not false (bad email)');
	t.equal(rule1('t@g.com').test, 'longerThen', 'The name prop of the incorrectly validated test is not correct (bad email)');

	// mapping

	let rule2 = makeRule.makeRule().isString().mapValue(value => parseInt(value, 10)).greaterThen(5);

	t.ok(rule2('6').result, 'The map value mapped correct for a valid test');
	t.notOk(rule2('2').result, 'The map value mapped correct for an invalid test');
	t.equal(rule2('2').test, 'greaterThen', 'The map value mapped correct for a valid test');
	t.equal(rule2('6').value, 6, 'The test prop of the incorrectly validated value is not correct');

	t.end();

});

test('Test makeRule treatment ', t => {

	let rule1 = makeRule.makeRule();
	let rule2 = rule1.isString();

	t.notEqual(rule1, rule1.isString(), 'makeRule returns same function in chained call');
	t.notEqual(rule2, rule2.isEmail(), 'makeRule returns same function in 2 chained call');

	let rule3 = rule2.bind(this, 'hello');

	t.doesNotThrow(rule3, 'makeRule throws when this value is changed');
	t.ok(rule3().result, 'makeRule fails incorrectly when this value is changed');

	let rule4 = makeRule.makeRule().isString().longerThen(5).bind(t);

	t.notOk(rule4('123').result, 'makeRule passes incorrectly when this value is changed');
	

	t.end();

});

// test('validateWith outcomes', t => {

// 	let validator = makeRule.makeRule().isString().isEmail().longerThen(10);
// 	makeRule.validateWith()

// });
