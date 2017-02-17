# koa2-webpack-middleware-zm
[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) for [koa2](https://github.com/koajs/koa/tree/v2.x)

## Install
$ npm i koa2-webpack-middleware-zm -D

## Usage
``` javascript
const koa = require('koa2')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { koaDevMiddleware, koaHotMiddleware } = require('koa2-webpack-middleware-zm')

const devConfig = require('./webpack.dev.config')
const app = koa()
const devCompiler = webpack(devConfig)
// dev
const expressDevMiddleware = webpackDevMiddleware(devCompiler, {
	/* opt */
	publicPath: devConfig.output.publicPath,
	stats: {
		colors: true
	}
})
app.use(koaDevMiddleware(expressDevMiddleware))
/*
//ssr
expressDevMiddleware.fileSystem
*/
// hot
const expressHotMiddleware = webpackHotMiddleware(devCompiler, {/*opt*/})
app.use(koaDevMiddleware(expressHotMiddleware))
```

## HMR(hot) configure
1. webpack `plugins` configure
``` javascript
plugins: [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin()
]
```
2. webpack `entry` configure
``` javascript
entry: {
	app: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', 'app.js']
}
```
