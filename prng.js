
// based off https://gist.github.com/blixt/f17b47c62508be59987b

const P = 2147483646
const Q = 16807

module.exports = function prng (seed) {
    let a = seed % P
    if (a <= 0) a += (P - 1)
    return seed * Q % P
}