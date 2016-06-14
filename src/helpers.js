export function partial(fn) {
	var args = [...arguments].slice(1);
	return function() {
		return fn.apply(fn, args);
	}
}

export function mapValues(obj, fn) {
	let result = {};
	for (let key in obj) {
		result[key] = fn(obj[key], key);
	}
	return result;
}

export function assign() {
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