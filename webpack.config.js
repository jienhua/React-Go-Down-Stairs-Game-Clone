const path = require('path');
const webpack = require('webpack')

module.exports = {
	entry: './src/index.jsx',

	output: {
		path: path.resolve(__dirname+'/public'),
		filename: 'bundle.js',
		// publicPath: '/'
	},

	module:{
		// loaders: [
		// 	{
		// 		test: /.(js|jsx)$/,
		// 		exclude: /node_modules/,
		// 		loader: 'babel',
		// 		query: {
		// 			presets: ['react', 'es2015', 'stage-1']
		// 		}
		// 	}
		// ]
		rules:[
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-1']
				}
			}
		]
	},
	// devtool: 'eval',
	resolve: {
		alias:{
			components$: path.resolve(__dirname, 'src/components/index.js')
		},
		// mainFiles: ['index'],
		extensions: [
		// '*',
		'.js', 
		'.jsx']
	},

	plugins:[
		new webpack.optimize.UglifyJsPlugin()
	],

	devServer: {
		'contentBase': './public',
		'inline': true
	}
}