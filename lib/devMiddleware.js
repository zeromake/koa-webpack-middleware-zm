function koaDevMiddleware(expressDevMiddleware) {
    return function middleware(ctx, next) {
        return new Promise((resolve, reject) => {
            expressDevMiddleware(ctx.req, {
                end: (content) => {
                    ctx.body = content;
                    resolve();
                },
                setHeader: (name, value) => {
                    ctx.set(name, value);
                },
            }, reject);
        }).catch(next);
    };
}
module.exports = koaDevMiddleware;
