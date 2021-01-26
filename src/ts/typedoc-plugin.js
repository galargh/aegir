'use strict'
const { Converter } = require('typedoc/dist/lib/converter')
const path = require('path')
const fs = require('fs')

module.exports = function (PluginHost) {
  const app = PluginHost.owner
  const pkg = path.join(process.cwd(), 'package.json')
  let pkgJson

  try {
    pkgJson = JSON.parse(fs.readFileSync(pkg).toString())
  } catch (err) {
    throw new Error('cant find package.json')
  }
  /**
   * @param {import("typedoc/dist/lib/converter/context")} context
   * @param {import("typedoc/dist/lib/models/reflections/abstract").Reflection} reflection
   * @param {import("typescript").Node} node
   */
  const cb = (context, reflection, node) => {
    if (pkgJson && reflection.name === 'export=') {
      let name
      if (node) {
        name = node.symbol.escapedName
      }
      reflection.name = `${name || 'default'}`
    }
  }
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, cb)
}
