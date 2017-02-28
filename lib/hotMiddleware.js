function koaHotMiddleware(expressHotMiddleware) {
    return function middleware(ctx, next) {
        const res = ctx.res;
        const req = ctx.req;
        const resEnd = res.end;
        return new Promise((resolve) => {
            res.end = function resEndfun() {
                resEnd.apply(this, arguments);
                resolve(false);
            };
            expressHotMiddleware(req, res, () => {
                resolve(true);
            });
        }).then((err) => {
            if (err) { return next(); }
            return null;
        });
    };
}
module.exports = koaHotMiddleware;
