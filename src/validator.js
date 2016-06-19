import partial from 'partial';

export default function validator(testMap) {

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

	// assigns source objects props/vals to the first object in the arguments
	 function assign() {
		let objs = [...arguments].slice(1);
		let result = arguments[0];
		for (let i = 0; i < objs.length; i++) {
			let obj = objs[i];
			for (let key in obj) {
				result[key] = obj[key];
			}
		}
		return result;
	}

	function mapValues(obj, fn) {
		let result = {};
		for (let key in obj) {
			result[key] = fn(obj[key], key);
		}
		return result;
	}

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

			let assignedArgsFn = partial(testFn, ...arguments);

			if (!required) {
				assignedArgsFn = runIfValue(assignedArgsFn);
			}

			return rule.call(this, name, assignedArgsFn);
		}
	}

	/*----------------------------------------------------------
		Tests
	----------------------------------------------------------*/

	const standardTests = {};

	// Make your own test passing (fn) argument which can either be a predicate or regex
	standardTests.testWith = function(name, fn) {
		let testFn = fn instanceof RegExp ? (value => fn.test(value)) : fn;
		return rule.call(this, name, runIfValue(testFn));
	};

	// maps a value into another one and passes it along the chain. This works by returning a function instead of a boolean. The function will be
	// evaluated in the create result method.
	standardTests.mapValue = function(fn) {
		return rule.call(this, 'mapValue', (value) => partial(fn, value));	
	};

	standardTests.required = composeTest('required', value => ((value + '').length > 0), true);

	const composedTests = mapValues(testMap, (value, key) => composeTest(key, value));
	const tests = assign({}, composedTests, standardTests);

	/*----------------------------------------------------------
		Export
	----------------------------------------------------------*/

	const rule = function(name, fn = value => true) {

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

		let boundTests = mapValues(tests, testFn => testFn.bind(runFn));
		return assign(runFn, boundTests, { validator: true });

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
				return assign(report, { message: evaluateError(report) });
			}
			return report;
		}
	}

	return { rule, validateWith };

};