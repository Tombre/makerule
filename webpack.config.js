var path = require('path');
var webpack = require('webpack');
var env = process.env.WEBPACK_ENV;
var src = path.join(__dirname, 'src');

module.exports = {

	entry: {
		"isvalid": path.join(__dirname, 'src', 'index'),
		"validator": [path.join(__dirname, 'src', 'validator')],
		"tests": [path.join(__dirname, 'src', 'tests')],
	},

	output: {
		path: path.join(__dirname, 'lib'),
		filename: "[name].js",
		libraryTarget: 'umd',
		umdNamedDefine: true
	},

	module: {
		preLoaders: [
			{test: /\.js$/, exclude: /(node_modules|vendor)/, loader: "eslint-loader"}
		],
		loaders: [
			{ test: /\.js$/, loaders: ['babel-loader'], include: src, exclude: /(node_modules)/ },
		]
	},

	stats: {
		colors: true
	},

	plugins: [
		// Avoid publishing files when compilation failed
		new webpack.NoErrorsPlugin(),
	]
};
