function koaDevMiddleware(expressDevMiddleware) {
  return function middleware(ctx, next) {
    return new Promise((resolve) => {
      expressDevMiddleware(ctx.req, {
        end: (content) => {
          ctx.body = content;
          resolve();
        },
        setHeader: (name, value) => {
          ctx.headers[name] = value;
        },
      }, next);
    });
  };
}
module.exports = koaDevMiddleware;
