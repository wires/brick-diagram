const R = require('ramda')
const D = require('./diag.js')
const m = require('mithril')

const prng = require('./prng.js')

var Opstack = {
    rect: (x,y,w,h,c) => {
        let ctx = Opstack.ctx
        ctx.beginPath()
        ctx.rect(x,y,w,h)
        ctx.fillStyle = c ? c : 'gray'
        ctx.fill()
    },
    oncreate: (vnode) => {
        Opstack.canvas = vnode.dom
        Opstack.ctx = Opstack.canvas.getContext('2d')
        Opstack.onupdate(vnode)
    },
    onupdate: (vnode) => {
        let d = vnode.attrs.d
        
        
        let s = 14
        let w = d.w
        let h = D.height(d)
        let cw = s * w
        let ch = s * h

        // resize canvas
        Opstack.canvas.width  = cw
        Opstack.canvas.height = ch
        
        // clear background
        Opstack.rect(0,0,cw,ch)

        
        let k = D.k(d) // alphabet
        // let H = (n) => prng(n) % k // "hash" over k
        // let q = Math.ceil(k / 3) // hash divided over RGB
        // let Q = Math.ceil(256 / q)
        // let l = (n,p) => H(n) / Math.pow(q, p)
        let H = (n) => prng(n)// % k // "hash" over k
        let l = (n,i) => H((n + 1337346) * (i*i)) * 9 % 256
        let r = o => l(o,3)
        let g = o => l(o,5)
        let b = o => l(o,7)
        
        console.log(`k=${k},q=${0},l(1,0)=${l(1,1)}, rgb=[${r(1)},${g(1)},${b(1)}]`)

        // draw grid
        for(let i of R.range(0, w)) {
            for(let j of R.range(0, h)) {
                let op = d.ops[w * j + i]
                
                // pseudo random colors
                // let clr = `rgb(${h(op,0)},${h(op,1)},${h(op,2)})`
                // let clr = `rgb(${op*s},${op*s},${op*s})`
                let clr = `rgb(${r(op)},${g(op)},${b(op)})`
                
                // operator pixel
                let x = s * i
                let y = s * j
                Opstack.rect(x, y, x + s, y + s, clr)
            }
        }
    },
    view: () => m('canvas')
}

module.exports = Opstack