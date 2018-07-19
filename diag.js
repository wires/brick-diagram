const R = require('ramda')

function height (d) {
    return Math.ceil(d.ops.length / d.w)
}

function below (d,x,y) {
    let l = Math.min(height(d), y + 1)
    return d.ops[l * d.w + x]
}

function graph (d) {
    let offsets = R.range(0, d.ops.length)
    let edge = (offset) => {
        let y = Math.floor(offset / d.w)
        let x = offset % d.w
        let t = below(d, x, y)
        let s = d.ops[offset]
        return (t && t !== s) ? [[s, t]] : []
    }
    return R.compose(
        R.uniq,
        R.unnest,
        R.map(edge)
    )(offsets)
}

module.exports = { height, below, graph }