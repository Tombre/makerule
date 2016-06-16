import testEmail from 'validator/lib/isEmail';
import testAlphanumeric from 'validator/lib/isAlphanumeric';
import testNumeric from 'validator/lib/isNumeric';
import testNumericFloat from 'validator/lib/isFloat';
import testAlpha from 'validator/lib/isAlpha';
import testCreditCard from 'validator/lib/isCreditCard';
import testDate from 'validator/lib/isDate';
import testURL from 'validator/lib/isURL';
import testDecimal from 'validator/lib/isDecimal';
import testHexColor from 'validator/lib/isHexColor';

// general
export const equals = (match, value) => (match === value);

// types
export const isString = value => (typeof value === 'string');
export const isObject = value => (typeof value === 'object' && value != null && !(value instanceof Array));
export const isArray = value => (typeof value === 'object' && value != null && value instanceof Array);
export const isBool = value => (typeof value === 'boolean');
export const isNumber = value => (typeof value === 'number' && !isNaN(value));
export const isInt = (value) => (isNumber(value) && (value % 1 === 0));
export const isFloat = (value) => (isNumber(value) && (value % 1 !== 0));

// string
export const isEmail = value => isString(value) && testEmail(value);
export const isCreditCard = value => isString(value) && testCreditCard(value);
export const isDateString = value => isString(value) && testDate(value);
export const isAlpha = value => isString(value) && testAlpha(value);
export const isAlphanumeric = value => isString(value) && testAlphanumeric(value);
export const isDecimalString = value => isString(value) && testDecimal(value);
export const isNumeric = value => isString(value) && testNumeric(value);
export const isNumericFloat = value => isString(value) && testNumericFloat(value);
export const isHexColor = value => isString(value) && testHexColor(value);
export const isURL = value => isString(value) && testURL(value);

// string/array
export const longerThen = (n, value) => (value.length && value.length > n);
export const shorterThen = (n, value) => (value.length && value.length < n);

// number
export const divisableBy = (n, value) => (isNumber(value) && value % n === 0);
export const greaterThen = (n, value) => (isNumber(value) && value > n);
export const lessThen = (n, value) => (isNumber(value) && value < n);

// Bool
export const isTrue = value => isBool(value) && value === true;
export const isFalse = value => isBool(value) && value === false;

// object/array
export const contains = (n, value) => { 
	if (isArray(value)) {
		if (isString(n)) {
			return value.indexOf(n) >= 0;
		}
		for (let i = n.length - 1; i >= 0; i--) {
			if (value.indexOf(n[i]) === -1) return false;
		}
		return true;
	} else if (isObject(value)) {
		if (isObject(n)) {
			for (let key in n) {
				if (n[key] !== value[key]) return false;
			}
			return true;
		}
	}
	return false;
};

export const isSame = (n, value) => { 

	var i, l, leftChain, rightChain;

	function compare2Objects (x, y) {
		var p;
		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
			return true;
		}
		// Compare primitives and functions.     
		// Check if both arguments link to the same object.
		// Especially useful on step when comparing prototypes
		if (x === y) {
			return true;
		}
		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if (
			(typeof x === 'function' && typeof y === 'function') ||
			(x instanceof Date && y instanceof Date) ||
			(x instanceof RegExp && y instanceof RegExp) ||
			(x instanceof String && y instanceof String) ||
			(x instanceof Number && y instanceof Number)) 
		{
			return x.toString() === y.toString();
		}

		// At last checking prototypes as good a we can
		if (!(x instanceof Object && y instanceof Object)) {
			return false;
		}

		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
			return false;
		}

		if (x.constructor !== y.constructor) {
			return false;
		}

		if (x.prototype !== y.prototype) {
			return false;
		}

		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			return false;
		}

		// Quick checking of one object beeing a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (p in y) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}
		}

		for (p in x) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}
			switch (typeof (x[p])) {
				case 'object':
				case 'function':
					leftChain.push(x);
					rightChain.push(y);
					if (!compare2Objects (x[p], y[p])) {
						return false;
					}
					leftChain.pop();
					rightChain.pop();
					break;
				default:
					if (x[p] !== y[p]) {
						return false;
					}
					break;
			}
		}

		return true;
	}

	if (arguments.length < 1) {
		return true;
	}

	leftChain = []; //Todo: this can be cached
	rightChain = [];
	if (!compare2Objects(value, n)) {
		return false;
	}

	return true;
}