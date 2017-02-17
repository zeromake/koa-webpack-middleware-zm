module.exports = (expressHotMiddleware) => {
	return function(ctx, next) {
		const res = ctx.res
        const req = ctx.req
        const resEnd = res.end
        return new Promise(function(resolve, reject){
            res.end = function() {
                resEnd.apply(this, arguments)
                resolve()
            }
			/*res.writeHead = function(state, headers) {
				ctx.state = state
				ctx.set(headers)
			}*/
            expressHotMiddleware(req, res, next)
        })
	}
}

