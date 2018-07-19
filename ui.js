const Y = require('js-yaml')
const R = require('ramda')
const m = require('mithril')
const stream = require('mithril/stream')

const D = require('./diag.js')
const P = require('./protobuf.js')

const Graph = require('./graph.js')
const Opstack = require('./opstack.js')
const mkMermaid = require('./mermaid.js')

const data = require('./data.js')

const initNumbers = data.numbers[0]


// TODO test & fix & spec
// turns `123\n33\n4` into [1,2,3,3,4]
const parseOpsString = s => {
    return s1 = R.compose(
        R.map(parseInt),
        R.split(''),
        R.join(''),
        R.map(R.trim),
        R.split('\n'),
        R.trim
    )(s)
}

const toDict = nrs => ({w: R.head(nrs), ops: R.tail(nrs)})

const numbers = stream(initNumbers)

const array = numbers.map(parseOpsString)
const json = array.map(toDict)

const pbuf = array.map(nrs => P.encode({nrs}))
const pbufz = array.map(nrs => P.encodeZ({nrs}))

const graph = json.map(D.graph)
const mermaid = graph.map(mkMermaid)

function setHeight(domNode) {
    domNode.style.height = ''; // reset before recalculating
    domNode.style.height = `${domNode.scrollHeight}px`;
}

function Textarea () {
    return {
        oncreate: ({dom}) => numbers.map(() => setHeight(dom)),
        view: () => m('textarea.input', {
                style: 'width: 20em',
                value: numbers(),
                placeholder: initNumbers,
                oninput: m.withAttr('value', numbers)
            })
    }
}

const prop = (label, val) => m('p', [m('span',`${label}: `), m('b', val)])


const randomRow = (w) => R.join('', R.map(() => Math.floor(Math.random() * 9) + 1, R.range(0,w)))
const randomGrid = (w,h) => R.join('\n', R.map(() => randomRow(w), R.range(0, h)))

const randomDAG = (k) => () => {
    let w = Math.floor(Math.random() * k) + 1
    let h = Math.floor(Math.random() * k) + 2
    let nrs = `${w}\n${randomGrid(w,h)}`
    numbers(nrs)
    console.log(w, h, nrs)
}

var UI = {
    oninit: (vnode) => {
        // if loaded initially, update the stream (before first drawing)
        if (vnode.attrs.diag && numbers() !== vnode.attrs.diag) {
            numbers(vnode.attrs.diag)
        }

        // update the route when the contents are changed
        numbers.map(s => m.route.set('/:diag', {diag: s}))
    },
    view: (vnode) => {
        let isBetter = array().length < (2 * graph().length)
        return m('.ui', [
            m('.yaml',[
                m('h4', 'Encoding'),
                m('i', 'Press set or generate a graph'),
                m('p', [
                    m('button', {onclick: () => numbers(initNumbers)}, 'Initial'),
                    m('button', {onclick: () => numbers('3\n123\n444')}, 'Simple'),
                    m('button', {onclick: randomDAG(4)}, 'Small'),
                    m('button', {onclick: randomDAG(9)}, 'Big'),
                ]),
                m('.split', [
                    m('p', [
                        prop('width', json().w),
                        prop('height', D.height(json())),
                        prop('cells', json().ops.length),        
                    ]),
                    m('.opstack', [
                        m('h4', 'Operator Stack'),
                        m(Opstack, {d: json()})
                    ])
                ]),
                m(Textarea),
            ]),
            m('.protobuf',[
                m('h4', 'Protobuf'),
                prop('uncompressed', pbuf().length),
                m('pre.pbuf', pbuf().toString('hex')),
                prop('compressed', pbufz().length),
                m('pre.pbuf.z', pbufz().toString('hex')),
            ]),
            m('.yaml',[
                m('h4', 'YAML'),
                m('pre.encoded', Y.safeDump(json()))
            ]),
            m('.mermaid', [
                m('h4', 'Mermaid'),
                m('pre.mermaid', mermaid()),
            ]),
            m('.properties', [
                m('h4', 'Properties'),
                m('p', [
                    m('i', 'More efficient:'),
                    m('.is-better', {class: isBetter ? 'better' : 'worse'}, isBetter ? 'numbers' : 'edgebytes')
                ]),
                m('i', 'Encoding sizes, in bytes:'),
                m('p', [
                    prop('numbers', array().length),
                    prop('edges', graph().length),
                    prop('edgebytes', graph().length * 2)
                ])
            ]),
            m('.graph', [
                m('h4', 'Graphviz'),
                m(Graph, {dot: mermaid()})
            ]),
        ])
    }
}

module.exports = UI