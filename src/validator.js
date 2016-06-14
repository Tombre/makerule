import * as _ from './helpers';

/*----------------------------------------------------------
	Constructs
----------------------------------------------------------*/

function createResult(name = 'all', result = true, value) {

	// if the result is a function, assume the value is being mapped, so pass true as the real result and set the value as the fn result
	if (typeof result === 'function') {
		value = result();
		result = true;
	}

	let report = { result, value };
	if (result === false) {
		report.test = name;
	}
	return report;
}

/*----------------------------------------------------------
	Helper
----------------------------------------------------------*/

// Returns a function that will return the result of a testFn if the value being passed in exists
function runIfValue(testFn) {
	return function(value) {
		if (value == undefined || (value + '').length === 0) {
			return true;
		}
		return testFn(value);
	}
}

// Creates a validation function that allows you to pass arguments to it
function composeTest(name, testFn, required) {
	return function() {

		let additionalArgs = [...arguments];
		let boundFn = _.partial(testFn, ...additionalArgs);

		if (!required) {
			boundFn = runIfValue(boundFn);
		}

		return makeRule.call(this, name, boundFn);
	}
}

/*----------------------------------------------------------
	Tests
----------------------------------------------------------*/

const standardTests = {};

// Make your own test passing (fn) argument which can either be a predicate or regex
standardTests.testWith = function(name, fn) {
	let testFn = fn instanceof RegExp ? (value => fn.test(value)) : fn;
	return makeRule.call(this, name, runIfValue(testFn));
};

// maps a value into another one and passes it along the chain. This works by returning a function instead of a boolean. The function will be
// evaluated in the create result method.
standardTests.mapValue = function(fn) {
	return makeRule.call(this, 'mapValue', (value) => _.partial(fn, value));	
};

standardTests.required = composeTest('required', value => ((value + '').length > 0), true);

/*----------------------------------------------------------
	Export
----------------------------------------------------------*/

export default function validator(testMap) {
		
	testMap = _.assign({}, testMap, standardTests);

	const tests = _.mapObject(testMap, (value, key) => composeTest(key, value));

	const makeRule = function(name, fn = value => true) {

		let prevFn = this;

		let runFn = function(value) {
			if (prevFn && prevFn.validator === true) {
				let prevOutcome = prevFn(value);
				if (prevOutcome.result === false) {
					return prevOutcome
				}
				if (prevOutcome.value != undefined) {
					return createResult(name, fn(prevOutcome.value), prevOutcome.value);		
				}
			}
			return createResult(name, fn(value), value);
		}

		let boundTests = _.mapValues(tests, testFn => testFn.bind(runFn));
		return _.assign(runFn, boundTests, { validator: true });

	}

	const validateWith = function(validator, errorMap, defaultMsg) {

		var evaluateError;

		if (typeof errorMap === 'object') {

			 evaluateError = (report) => {
				for (let key in errorMap) {
					if (key === report.test) {
						return errorMap[key];
					}
				}
				return defaultMsg;
			}

		} else {
			defaultMsg = errorMap;
			evaluateError = report => {
				return defaultMsg;
			}
		}

		return function(value) {
			let report = validator(value);
			if (report.result === false) {
				return _.assign(report, { message: evaluateError(report) });
			}
			return report;
		}
	}

	return { makeRule, validateWith };

}