const webpackHotMiddleware = require('webpack-hot-middleware');

const koa = require('koa2');

const assert = require('assert');

const events = require('events');

const koaHotMiddleware = require('../lib/hotMiddleware');

const supertest = require('supertest');

const sinon = require('sinon');

describe('hot-middleware', () => {
  let s,
    compiler,
    app,
    hotMiddleware;
  context('with default options', () => {
    beforeEach(setupServer({ log() {} }));

    it('should create eventStream on /__webpack_hmr', (done) => {
      request('/__webpack_hmr').expect('Content-Type', /^text\/event-stream\b/).end(done);
    });
    it('should heartbeat every 10 seconds', (done) => {
      request('/__webpack_hmr').end((err, res) => {
        if (err) { return done(err); }

                // Tick 3 times, then verify
        let i = 0;
        tick(10, 'seconds');
        res.on('data', () => {
          if (++i < 3) {
            tick(10, 'seconds');
          } else {
            verify();
          }
        });

        function verify() {
          assert.equal(res.events.length, 3);
          res.events.every((chunk) => {
            assert(/^data: /.test(chunk));
          });
          done();
        }
      });
    });
    it('should notify clients when bundle rebuild begins', (done) => {
      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);

                  res.on('data', verify);

                  compiler.emit('compile');

                  function verify() {
                    assert.equal(res.events.length, 1);
                    const event = JSON.parse(res.events[0].substring(5));
                    assert.equal(event.action, 'building');
                    done();
                  }
                });
    });
    it('should notify clients when bundle is complete', (done) => {
      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);

                  res.on('data', verify);

                  compiler.emit('done', stats({
                    time: 100,
                    hash: 'deadbeeffeddad',
                    warnings: false,
                    errors: false,
                    modules: [],
                  }));

                  function verify() {
                    assert.equal(res.events.length, 1);
                    const event = JSON.parse(res.events[0].substring(5));
                    assert.equal(event.action, 'built');
                    done();
                  }
                });
    });
    it('should notify clients when bundle is complete (multicompiler)', (done) => {
      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);

                  res.on('data', verify);

                  compiler.emit('done', stats({
                    children: [{
                      time: 100,
                      hash: 'deadbeeffeddad',
                      warnings: false,
                      errors: false,
                      modules: [],
                    },
                    {
                      time: 150,
                      hash: 'gwegawefawefawef',
                      warnings: false,
                      errors: false,
                      modules: [],
                    },
                    ],
                  }));

                  function verify() {
                    assert.equal(res.events.length, 1);
                    const event = JSON.parse(res.events[0].substring(5));
                    assert.equal(event.action, 'built');
                    done();
                  }
                });
    });
    it('should notify new clients about current compilation state', (done) => {
      compiler.emit('done', stats({
        time: 100,
        hash: 'deadbeeffeddad',
        warnings: false,
        errors: false,
        modules: [],
      }));

      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);
                  assert.equal(res.events.length, 1);
                  const event = JSON.parse(res.events[0].substring(5));
                  assert.equal(event.action, 'sync');
                  done();
                });
    });
    it('should have tests on the payload of bundle complete');
    it('should notify all clients', (done) => {
      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);
                  res.on('data', verify);
                  when();
                });
      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);
                  res.on('data', verify);
                  when();
                });

            // Emit compile when both requests are connected
      when.n = 0;

      function when() {
        if (++when.n < 2) return;

        compiler.emit('compile');
      }

            // Finish test when both requests report data
      verify.n = 0;

      function verify() {
        if (++verify.n < 2) return;

        done();
      }
    });
    it('should allow custom events to be published', (done) => {
      request('/__webpack_hmr')
                .end((err, res) => {
                  if (err) return done(err);
                  res.on('data', verify);

                  hotMiddleware.publish({ obj: 'with stuff' });

                  function verify() {
                    assert.equal(res.events.length, 1);
                    const event = JSON.parse(res.events[0].substring(5));
                    assert.deepEqual(event, { obj: 'with stuff' });
                    done();
                  }
                });
    });
  });
  beforeEach(() => {
    s = sinon.sandbox.create();
    s.useFakeTimers();
    compiler = new (events.EventEmitter)();
    compiler.plugin = compiler.on;
  });
  afterEach(() => {
    s.restore();
  });

  function tick(time, unit) {
    if (unit == 'seconds') { time *= 1000; }
    s.clock.tick(time + 10); // +10ms for some leeway
  }

  function setupServer(opts) {
    return function () {
      app = new koa();
      hotMiddleware = webpackHotMiddleware(compiler, opts);
      app.use(koaHotMiddleware(hotMiddleware));
    };
  }

  function request(path) {
    const req = supertest(app.listen()).get(path).buffer(false);
    const end = req.end;
    req.end = function (callback) {
      req.on('error', callback).on('response', (res) => {
        Object.defineProperty(res, 'events', {
          get() {
            return res.text.trim().split('\n\n');
          },
        });
        res.on('data', (chunk) => {
          res.text = (res.text || '') + chunk;
        });
        process.nextTick(() => {
          req.assert(null, res, (err) => {
            callback(err, res);
          });
        });
      });

      end.call(req, () => {});
    };
    return req;
  }

  function stats(data) {
    return {
      toJson() {
        return data;
      },
    };
  }
});
