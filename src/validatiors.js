import * as testMap from './tests/tests';

/*----------------------------------------------------------
	Constructs
----------------------------------------------------------*/

function createResult(name = 'all', result = true, value) {

	// if the result is a function, assume the value is being mapped, so pass true as the real result and set the value as the fn result
	if (_.isFunction(result)) {
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
		if (_.isNull(value) || _.isUndefined(value) || (value + '').length === 0) {
			return true;
		}
		return testFn(value);
	}
}

// Creates a validation function that allows you to pass arguments to it
function composeTest(name, testFn, required) {
	return function() {

		let additionalArgs = _.toArray(arguments);
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

const tests = _.mapObject(testMap, (value, key) => composeTest(key, value));

// Make your own test passing (fn) argument which can either be a predicate or regex
tests.testWith = function(name, fn) {
	let testFn = fn instanceof RegExp ? (value => fn.test(value)) : fn;
	return makeRule.call(this, name, runIfValue(testFn));
}

// maps a value into another one and passes it along the chain. This works by returning a function instead of a boolean. The function will be
// evaluated in the create result method.
tests.mapValue = function(fn) {
	return makeRule.call(this, 'mapValue', (value) => _.partial(fn, value));	
};

tests.required = composeTest('required', value => (_.toString(value).length > 0), true);

/*----------------------------------------------------------
	Export
----------------------------------------------------------*/

export function makeRule(name, fn = value => true) {

	let prevFn = this;

	let runFn = function(value) {
		if (prevFn && prevFn.validator === true) {
			let prevOutcome = prevFn(value);
			if (prevOutcome.result === false) {
				return prevOutcome
			}
			if (!_.isUndefined(prevOutcome.value)) {
				return createResult(name, fn(prevOutcome.value), prevOutcome.value);		
			}
		}
		return createResult(name, fn(value), value);
	}

	let boundTests = _.mapObject(tests, testFn => _.bind(testFn, runFn));
	return _.assign(runFn, boundTests, { validator: true });

}

export function validateWith(validator, errorMap, defaultMsg) {

	var evaluateError;

	if ( _.isObject(errorMap)) {

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
			return _.extend(report, { message: evaluateError(report) });
		}
		return report;
	}
}

export default { makeRule, validateWith };