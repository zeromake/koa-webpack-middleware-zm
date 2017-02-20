const koa = require('express')
const app = new koa()
const events = require('events');
const webpackHotMiddleware = require('webpack-hot-middleware')
const koaHotMiddleware = require('../lib/hotMiddleware')

compiler = new (events.EventEmitter)()
compiler.plugin = compiler.on
hotMiddleware = webpackHotMiddleware(compiler, {log: function(){}})
app.use(hotMiddleware)
app.listen(8000)