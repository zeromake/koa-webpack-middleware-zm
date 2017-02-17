const koaDevMiddleware = require('./devMiddleware')
const koaHotMiddleware = require('./hotMiddleware')
module.exports = {
	koaDevMiddleware: koaDevMiddleware,
	koaHotMiddleware: koaHotMiddleware
}