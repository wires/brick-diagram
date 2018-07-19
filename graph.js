const m = require('mithril')

var Graph = {
    oncreate: (vnode) => {
        Graph.svg = d3.select('#graph').graphviz().fade(false)
        Graph.onupdate(vnode)
    },
    onupdate: (vnode) => {
        Graph.svg.renderDot(vnode.attrs.dot)
    },
    view: () => m('#graph', {style: {'text-align': 'center'}})
}

module.exports = Graph