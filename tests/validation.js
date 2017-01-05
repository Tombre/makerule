import test from 'tape';
import * as tests from '../src/tests';

test('Testing results of equals validator', t => {
	t.ok(tests.equals(1, 1), 'does not produce true on correct use');
	t.notOk(tests.equals('yo', 'what'), 'does not produce false on incorrect use');
	t.notOk(tests.equals({ value: 3}, { value: 3 }), 'does not produce false on object equality test');
	t.end();
});

test('Testing results of isString validator', t => {	
	t.ok(tests.isString('hi'), 'does not produce true on correct use');
	t.notOk(tests.isString(true), 'does not produce false on incorrect use');
	t.end();
});

test('Testing results of isArray validator', t => {	
	t.ok(tests.isArray([1, 5, 6]), 'does not produce true on correct use');
	t.ok(tests.isArray(['1', '5', '6']), 'does not produce true on correct use');
	t.notOk(tests.isArray({ a : 1}), 'does not produce false on incorrect use (null)');
	t.notOk(tests.isArray(arguments), 'does not produce false on incorrect use (arguments)');
	t.notOk(tests.isArray(null), 'does not produce false on incorrect use (null)');
	t.notOk(tests.isArray('null'), 'does not produce false on incorrect use (string)');
	t.end();
});

test('Testing results of isObject validator', t => {	
	t.ok(tests.isObject({ h: 1 }), 'does not produce true on correct use');
	t.notOk(tests.isObject(23), 'does not produce false on incorrect use (null)');
	t.notOk(tests.isObject([23]), 'does not produce false on incorrect use (null)');
	t.notOk(tests.isObject(null), 'does not produce false on incorrect use (null)');
	t.notOk(tests.isObject('null'), 'does not produce false on incorrect use (string)');
	t.end();
});

test('Testing results of isBool validator', t => {	
	t.ok(tests.isBool(true), 'does not produce true on correct use');
	t.notOk(tests.isBool('true'), 'does not produce false on incorrect use');
	t.end();
});

test('Testing results of isNumber validator', t => {	
	t.ok(tests.isNumber(4), 'does not produce true on correct use');
	t.ok(tests.isNumber(4.6), 'does not produce true on correct use (decimal)');
	t.notOk(tests.isNumber('not true'), 'does not produce false on incorrect use');
	t.end();
});

test('Testing results of isInt validator', t => {	
	t.ok(tests.isInt(4), 'does not produce true on correct use');
	t.notOk(tests.isInt(4.6), 'does not produce false on incorrect use of decimal');
	t.notOk(tests.isInt('4'), 'does not produce false on incorrect use');
	t.end();
});

test('Testing results of isFloat validator', t => {	
	t.ok(tests.isFloat(4.6), 'does not produce true on correct use');
	t.notOk(tests.isFloat(4), 'does not produce false on incorrect use of decimal');
	t.notOk(tests.isFloat('4.6'), 'does not produce false on incorrect use');
	t.end();
});

test('Testing results of isEmail validator', t => {	
	t.ok(tests.isEmail('test@test.com'), 'does not produce true on correct use');
	t.notOk(tests.isEmail('hi there'), 'does not produce false on incorrect use');
	t.notOk(tests.isEmail(5), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isCreditCard validator', t => {	
	t.ok(tests.isCreditCard('5500 0000 0000 0004'), 'does not produce true on correct use');
	t.ok(tests.isCreditCard('4111111111111111'), 'does not produce true on correct use (no white space)');
	t.notOk(tests.isCreditCard('hi there'), 'does not produce false on incorrect use');
	t.notOk(tests.isCreditCard(4111111111111111), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isDateString validator', t => {	
	t.ok(tests.isDateString('10/12/16'), 'does not produce true on correct use');
	t.notOk(tests.isDateString('hi there'), 'does not produce false on incorrect use');
	t.notOk(tests.isDateString(4111111111111111), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isAlpha validator', t => {	
	t.ok(tests.isAlpha('dwefwefwesdfwd'), 'does not produce true on correct use');
	t.notOk(tests.isAlpha('@#*^(@#23322cwefwe'), 'does not produce false on incorrect use');
	t.notOk(tests.isAlpha(5), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isAlphanumeric validator', t => {	
	t.ok(tests.isAlphanumeric('dwefwefwesd234242342fwd'), 'does not produce true on correct use');
	t.notOk(tests.isAlphanumeric('@#*^(@#'), 'does not produce false on incorrect use');
	t.notOk(tests.isAlphanumeric(5), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isDecimalString validator', t => {	
	t.ok(tests.isDecimalString('1.3'), 'does not produce true on correct use');
	t.ok(tests.isDecimalString('1'), 'does not produce true on correct use');
	t.notOk(tests.isDecimalString('1.o'), 'does not produce false on incorrect use (letter)');
	t.notOk(tests.isDecimalString(5.4), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isNumeric validator', t => {	
	t.ok(tests.isNumeric('23322'), 'does not produce true on correct use');
	t.notOk(tests.isNumeric('fwe2332sew'), 'does not produce false on incorrect use (letter)');
	t.notOk(tests.isNumeric(5.4), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isHexColor validator', t => {	
	t.ok(tests.isHexColor('#fff'), 'does not produce true on correct use');
	t.notOk(tests.isHexColor('#ewfw23fwew'), 'does not produce false on incorrect use');
	t.notOk(tests.isHexColor('fwe2332sew'), 'does not produce false on incorrect use (letters only)');
	t.notOk(tests.isHexColor(5.4), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of isURL validator', t => {	
	t.ok(tests.isURL('www.facebook.com'), 'does not produce true on correct use');
	t.ok(tests.isURL('http://www.facebook.com'), 'does not produce true on correct use');
	t.notOk(tests.isURL('httpf://www/facebook.com'), 'does not produce false on incorrect use');
	t.notOk(tests.isURL('fwe2332sew'), 'does not produce false on incorrect use (letters only)');
	t.notOk(tests.isURL(5.4), 'does not produce false on incorrect use (number)');
	t.end();
});

test('Testing results of longerThan validator', t => {	
	t.ok(tests.longerThan(6, 'testfor6'), 'does not produce true on correct use');
	t.ok(tests.longerThan(3, [1, 2, 3, 4]), 'does not produce true on correct use');
	t.notOk(tests.longerThan(3, '123'), 'does not produce false on incorrect use');
	t.notOk(tests.longerThan(2, [1]), 'does not produce false on incorrect use (array)');
	t.end();
});

test('Testing results of shorterThan validator', t => {	
	t.ok(tests.shorterThan(20, 'testfor6'), 'does not produce true on correct use');
	t.ok(tests.shorterThan(5, [1, 2, 3, 4]), 'does not produce true on correct use');
	t.notOk(tests.shorterThan(3, '123'), 'does not produce false on incorrect use');
	t.notOk(tests.shorterThan(1, [1]), 'does not produce false on incorrect use (array)');
	t.end();
});

test('Testing results of shorterThan validator', t => {	
	t.ok(tests.shorterThan(20, 'testfor6'), 'does not produce true on correct use');
	t.ok(tests.shorterThan(5, [1, 2, 3, 4]), 'does not produce true on correct use');
	t.notOk(tests.shorterThan(3, '123'), 'does not produce false on incorrect use');
	t.notOk(tests.shorterThan(1, [1]), 'does not produce false on incorrect use (array)');
	t.end();
});

test('Testing results of divisableBy validator', t => {	
	t.ok(tests.divisableBy(2, 10), 'does not produce true on correct use');
	t.notOk(tests.divisableBy(11, 3), 'does not produce true on correct use');
	t.notOk(tests.divisableBy('3', 10), 'does not produce false on incorrect use');
	t.end();
});

test('Testing results of greaterThan validator', t => {	
	t.ok(tests.greaterThan(20, 21), 'does not produce true on correct use');
	t.notOk(tests.greaterThan(3, 1), 'does not produce false on incorrect use');
	t.notOk(tests.greaterThan(1, '6'), 'does not produce false on incorrect use (array)');
	t.notOk(tests.greaterThan(0, -10), 'does not produce true on 0 number');
	t.end();
});

test('Testing results of lessThan validator', t => {	
	t.ok(tests.lessThan(20, 1), 'does not produce true on correct use');
	t.notOk(tests.lessThan(3, 12), 'does not produce false on incorrect use');
	t.notOk(tests.lessThan(1, '123'), 'does not produce false on incorrect use (array)');
	t.end();
});

test('Testing results of isTrue validator', t => {	
	t.ok(tests.isTrue(true), 'does not produce true on correct use');
	t.notOk(tests.isTrue(false), 'does not produce false on incorrect use');
	t.notOk(tests.isTrue('false'), 'does not produce false on incorrect use (string)');
	t.end();
});

test('Testing results of contains validator', t => {	
	t.ok(tests.contains({ a : 1 }, { a : 1, b : 2 }), 'does not produce true on correct use (object)');
	t.ok(tests.contains([1, 'hi'], [1, 5, 'hi']), 'does not produce true on correct use (array)');
	t.ok(tests.contains('hi', [1, 5, 'hi']), 'does not produce true on correct use (value)');
	t.notOk(tests.contains({ c : 5 }, { a : 3, b: 2 }), 'does not produce false on incorrect use (object)');
	t.notOk(tests.contains(true, {a : 1}), 'does not produce false on incorrect use (object with incorrect val)');
	t.notOk(tests.contains([1], 3), 'does not produce false on incorrect use (array)');
	t.notOk(tests.contains([3, 6], [1]), 'does not produce false on incorrect use (array multi)');
	t.notOk(tests.contains(5, 1), 'does not produce false on incorrect use (bad input)');
	t.end();
});

test('Testing results of isSame validator', t => {	
	t.ok(tests.isSame({ a : 1, b : 2 }, { a : 1, b : 2 }), 'does not produce true on correct use (object)');
	t.ok(tests.isSame([1, 'hi'], [1, 'hi']), 'does not produce true on correct use (array)');
	t.ok(tests.isSame({ a : { v : 1, f : [0, 1, { g : 3 }] }, b : 'yo'}, { a : { v : 1, f : [0, 1, { g : 3 }] }, b : 'yo'}), 'does not produce true on correct use (nested object)');
	t.notOk(tests.isSame({ c : 5 }, { a : 3, b: 2 }), 'does not produce false on incorrect use (object)');
	t.notOk(tests.isSame(true, {a : 1}), 'does not produce false on incorrect use (object with incorrect val)');
	t.notOk(tests.isSame([1], {a : 2}), 'does not produce false on incorrect use (array)');
	t.notOk(tests.isSame([3, 6], [1]), 'does not produce false on incorrect use (array multi)');
	t.notOk(tests.isSame(5, 1), 'does not produce false on incorrect use (bad input)');
	t.end();
});

