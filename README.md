[![npm][npm]][npm-url]
[![node][node]][node-url]
[![Travis Build Status](https://travis-ci.org/zeromake/koa-webpack-middleware-zm.svg?branch=master)](https://travis-ci.org/zeromake/koa-webpack-middleware-zm)
[![npm install](https://img.shields.io/npm/dm/koa-webpack-middleware-zm.svg)](https://npmjs.com/package/koa-webpack-middleware-zm)
[![Coverage Status](https://coveralls.io/repos/github/zeromake/koa-webpack-middleware-zm/badge.svg?branch=master)](https://coveralls.io/github/zeromake/koa-webpack-middleware-zm?branch=master)

# koa-webpack-middleware-zm
[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) for [koa](https://github.com/koajs/koa)

## Install
$ npm i koa-webpack-middleware-zm -D

## Usage
``` javascript
const koa = require('koa')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { koaDevMiddleware, koaHotMiddleware } = require('koa-webpack-middleware-zm')

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
app.use(koaHotMiddleware(expressHotMiddleware))
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

[npm]: https://img.shields.io/npm/v/koa-webpack-middleware-zm.svg
[npm-url]: https://npmjs.com/package/koa-webpack-middleware-zm

[node]: https://img.shields.io/node/v/koa-webpack-middleware-zm.svg
[node-url]: https://nodejs.org
