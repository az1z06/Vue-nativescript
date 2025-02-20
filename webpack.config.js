const webpack = require("@nativescript/webpack");
const path = require('path');

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	const config = webpack.resolveConfig();

	// Ajoutez les fallbacks ici
	config.resolve.fallback = {
		"http": require.resolve("stream-http"),
		"https": require.resolve("https-browserify"),
		"url": require.resolve("url/"),
		"zlib": require.resolve("browserify-zlib"),
		"assert": require.resolve("assert/"),
		"stream": require.resolve("stream-browserify"),
		"os": require.resolve("os-browserify/browser"),
		"tty": require.resolve("tty-browserify"),
		"util": require.resolve("util/"),
		"buffer": require.resolve("buffer/"),
	};

	return config;
};
