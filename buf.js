const zlib = require('zlib')

// g.f = id
f = x => zlib.deflateSync(x)
g = x => zlib.inflateSync(x)

exports.enZ = (nrs) => f(nrs)
exports.deZ= (buf) => g(buf)