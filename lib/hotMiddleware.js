function koaHotMiddleware(expressHotMiddleware) {
  return function middleware(ctx, next) {
    const res = ctx.res;
    const req = ctx.req;
    const resEnd = res.end;
    return new Promise((resolve) => {
      res.end = function resEndfun(...args) {
        resEnd.apply(this, args);
        resolve();
      };
      /* res.writeHead = function(state, headers) {
       ctx.state = state
       ctx.set(headers)
      } */
      expressHotMiddleware(req, res, next);
    });
  };
}
module.exports = koaHotMiddleware;