function koaHotMiddleware(expressHotMiddleware) {
    return function middleware(ctx, next) {
        return new Promise((resolve) => {
            expressHotMiddleware(ctx.req, ctx.res, resolve);
        }).then(next);
    };
}
module.exports = koaHotMiddleware;
