const webpackDevMiddleware = require('webpack-dev-middleware')

const koa = require('koa')

const koaDevMiddleware = require("../lib/devMiddleware")
const webpack = require("webpack")
const request = require("supertest")
const webpackConfig = require("./fixtures/server-test/webpack.config")
const koaState =  require("./fixtures/server-test/serve")

describe('dev-middleware', function() {
    var app, listen

    function listenShorthand(done) {
        return app.listen(done)
    }

    function close(done) {
        if (listen) {
            listen.close(done)
        } else {
            done()
        }
    }
    describe("requests", function() {
        before(function(done) {
            app = new koa()
            const compiler = webpack(webpackConfig)
            const instance = webpackDevMiddleware(compiler, {
                stats: "errors-only",
                quiet: true,
                publicPath: "/public/",
            })
            app.use(koaDevMiddleware(instance))
            app.use(koaState('/public', { root: webpackConfig.context }))
            listen = listenShorthand(done)
            instance.fileSystem.writeFileSync("/123a123412.hot-update.json", "[\"hi\"]")
        })
        after(close)
        it("GET request to bundle file", function(done){
            request(listen).get('/public/bundle.js')
            .expect("Content-Type", "application/javascript; charset=UTF-8")
            .expect("Content-Length", "2869")
            .expect("Access-Control-Allow-Origin", "*")
            .expect(200, /console\.log\("Hey\."\)/, done);
        })
        it("POST request to bundle", function(done){
            request(listen).post('/public/bundle.js')
            .expect(404, done)
        })
        it("request to image", function(done) {
            request(listen).get('/public/svg.svg')
            .expect("Content-Type", "image/svg+xml")
            .expect("Content-Length", "4778")
            .expect(200, done)
        })
        it("request to non existiong file", function(done) {
            request(listen).get('/public/nope')
            .expect("Content-Type", "text/plain; charset=utf-8")
            .expect(404, done)
        })
        it("request to HMR json", function(done) {
            request(listen).get("/public/123a123412.hot-update.json")
            .expect("Content-Type", "application/json; charset=UTF-8")
            .expect(200, /\[\"hi\"\]/, done)
        })
        it("request to index.html", function(done) {
            request(listen).get('/public/index.html')
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect("Content-Length", "10")
            .expect(200, /My\ Index\./, done)
        })
        // koa-send no range
        /*it("invalid range header", function(done) {
            request(listen).get("/public/svg.svg")
            .set("Range", "bytes=6000-")
            .expect(416, done)
        })
        it("valid range header", function(done){
            request(listen).get("/public/svg.svg")
            .set("Range", "bytes=3000-3500")
            .expect("Content-Length", "4778")
            .expect("Content-Range", "bytes 3000-3500/4778")
            .expect(206, done)
        })*/
    })
})
