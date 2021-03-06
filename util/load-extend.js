'use strict'

const logger = require('./logger')
const isObject = require('./is').object
const exec = require('./exec')
const pluginExists = require('./check').pluginExists

/* istanbul ignore next */
const importExtend = (extend, cooking, options) => {
  require(`cooking-${extend}`)(cooking, options)
  logger.success(`插件加载成功: ${extend}`)
}

/* istanbul ignore next */
const installExtend = name => {
  logger.warn(`插件不存在，自动下载插件: ${name}`)
  exec('cooking', ['import', name], {
    stdio: 'inherit'
  })
}

/* istanbul ignore next */
/**
 * 加载并装配插件
 * @param  {array} extends
 * @param  {object} config - webpack config
 */
module.exports = (_extends, cooking) => {
  const isObj = isObject(_extends)

  Object.keys(_extends || {}).forEach(key => {
    const extend = isObj ? key : _extends[key]
    const options = isObj ? _extends[key] : {}
    const extendName = extend.split('@')[0]

    if (!pluginExists(`cooking-${extendName}`)) {
      installExtend(extend)
    }

    importExtend(extendName, cooking, options)
  })
  console.log()
}
