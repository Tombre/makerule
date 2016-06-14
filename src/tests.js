import testEmail from 'validator/lib/isEmail';
import testAlphanumeric from 'validator/lib/isAlphanumeric';
import testNumeric from 'validator/lib/isNumeric';
import testNumericFloat from 'validator/lib/isFloat';
import testAlpha from 'validator/lib/isAlpha';
import testCreditCard from 'validator/lib/isCreditCard';
import testDate from 'validator/lib/isDate';
import isBefore from 'validator/lib/isBefore';
import testURL from 'validator/lib/isURL';
import testDecimal from 'validator/lib/isDecimal';
import testHexColor from 'validator/lib/isHexColor';
import isAfter from 'validator/lib/isAfter';

// general
export const equals = (match, value) => (match === value);

// types
export const isString = value => (typeof value === 'string');
export const isNumber = value => (typeof value === 'number' && !isNaN(value));
export const isInt = (n, value) => (isNumber(value) && (n % 1 === 0));
export const isFloat = (n, value) => (isNumber(value) && (n % 1 !== 0));

// string
export const isEmail = value => testEmail(value);
export const isCreditCard = value => testCreditCard(value);
export const isDate = value => testDate(value);
export const isBeforeDate = (date, value) => isBefore(value, date);
export const isAfterDate = (date, value) => isAfter(value, date);
export const isAlpha = value => testAlpha(value);
export const isAlphanumeric = value => testAlphanumeric(value);
export const isDecimal = value => testDecimal(value);
export const isNumeric = value => testNumeric(value);
export const isNumericFloat = value => testNumericFloat(value);
export const isHexColor = value => testHexColor(value);
export const isURL = value => testURL(value);
export const longerThen = (n, value) => (value.length > n);
export const shorterThen = (n, value) => (value.length < n);

// number
export const divisableBy = (n, value) => (value % n === 0);
export const greaterThen = (n, value) => (value > n);
export const lessThen = (n, value) => (value < n);


// Bool
