const protobuf = require('protocol-buffers')
const zlib = require('zlib')

// g.f = id
f = x => zlib.deflateSync(x)
g = x => zlib.inflateSync(x)

exports.proto = proto = `// encoding of diagram
message Diagram {
    repeated int32 nrs = 1 [pack=true];
}`

// load & parse protobuf schema
const {Diagram} = protobuf(proto)

exports.encodeZ = (obj) => f(Diagram.encode(obj))
exports.decodeZ= (buf) => Diagram.decode(g(buf))

exports.encode = Diagram.encode.bind(Diagram)
exports.decode = Diagram.decode.bind(Diagram)