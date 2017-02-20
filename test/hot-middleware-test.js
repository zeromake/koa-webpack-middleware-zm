const webpackHotMiddleware = require('webpack-hot-middleware')

const koa = require('koa2')

const chai = require('chai')

const events = require('events');

const koaHotMiddleware = require('../lib/hotMiddleware')

const supertest = require('supertest');
const sinon = require('sinon')

describe('hot-middleware', function(){
	let s, compiler, app, hotMiddleware
	context("with default options", function(){
		beforeEach(setupServer({log: function(){}}));

		it("should create eventStream on /__webpack_hmr", function(done) {
			request('/__webpack_hmr')
			.expect('Content-Type', /^text\/plain\b/)
			.end(done);
		});
	})
	beforeEach(function(){
		s = sinon.sandbox.create()
		s.useFakeTimers()
		compiler = new (events.EventEmitter)()
		compiler.plugin = compiler.on
	})
	afterEach(function(){
		s.restore()
	})
	function setupServer(opts) {
		return function() {
			app = new koa()
			hotMiddleware = webpackHotMiddleware(compiler, opts)
			app.use(koaHotMiddleware(hotMiddleware))
		}
	}
	function request(path) {
		let req = supertest(app.listen()).get(path)
		console.log(req)
		return req
	}
})