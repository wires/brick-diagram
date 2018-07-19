const R = require('ramda')

const enc = x => x//Buffer.from([x]).toString('hex')
const mkEdge = ([s,t]) => `${enc(s)}->${enc(t)};`
const mkMermaid = R.compose(
    x => `digraph {\n${x}\n}`,
    R.join('\n'),
    R.map(mkEdge)
)

module.exports = mkMermaid