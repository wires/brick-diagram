const UI = require('./ui.js')
const ready = require('./ready.js')
const m = require('mithril')

module.exports = async function (rootId) {
    await ready()
    let root = document.getElementById(rootId)
    m.route(root, "/", {
        "/": UI,
        "/:diag": UI,
    })
}