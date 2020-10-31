import through from 'through2'
import PluginError from 'plugin-error'
import { salute } from './salute'

const { name } = require('../package.json')
const PLUGIN_NAME = name

const myPlugin = () =>
  through.obj(async function (file, _, callback) {
    if (file.isNull()) {
      callback(null, file)
      return
    }

    if (file.isStream()) {
      callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      return
    }

    if (file.contents.toString().length > 10) {
      callback(new PluginError(PLUGIN_NAME, 'Name too long'))
      return
    }

    try {
      const newContents = await salute(file.contents)
      file.contents = Buffer.from(newContents)
      this.push(file)
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err))
    }

    callback()
  })

export default myPlugin
