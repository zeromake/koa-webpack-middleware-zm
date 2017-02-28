function koaDevMiddleware(expressDevMiddleware) {
    return function middleware(ctx, next) {
        return new Promise((resolve) => {
            expressDevMiddleware(ctx.req, {
                end: (content) => {
                    ctx.body = content;
                    resolve(false);
                },
                setHeader: (name, value) => {
                    ctx.set(name, value);
                },
            }, () => {
                resolve(true);
            });
        }).then((err) => {
            if (err) { return next(); }
            return null;
        });
    };
}
module.exports = koaDevMiddleware;
