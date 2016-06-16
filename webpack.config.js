var path = require('path');
var webpack = require('webpack');
var env = process.env.WEBPACK_ENV;
var src = path.join(__dirname, 'src');

var bundleConfig = {
	entry: {
		validator: path.join(__dirname, 'src', 'validator'),
		tests: path.join(__dirname, 'src', 'tests'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: "[name].js",
		libraryTarget: 'umd',
		library: ["makeRule", "[name]"],
		umdNamedDefine: true
	},
};

var compileConfig = {
	entry: path.join(__dirname, 'src', 'index'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: "index.js",
		libraryTarget: 'umd',
		library: 'makeRule',
		umdNamedDefine: true
	},
};

module.exports = {

	entry: (env === "bundle" ? bundleConfig.entry : compileConfig.entry),
	output: (env === "bundle" ? bundleConfig.output : compileConfig.output),

	module: {
		preLoaders: [
			{test: /\.js$/, exclude: /(node_modules|vendor)/, loader: "eslint-loader"}
		],
		loaders: [
			{ 
				test: /\.js$/, 
				loader: 'babel-loader', 
				include: src, 
				exclude: /(node_modules)/, 
				query: { 
					plugins: ['add-module-exports'] 
				}
			},
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
