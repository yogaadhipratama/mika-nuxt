'use strict'

const configName = 'transactionManager'

let baseConfig = {
  transactionTimeout: process.env.MIKA_TRANSACTION_TIMEOUT || 120000 // in milliseconds
}

/**
 * Load external config file '${configName}_extra.js' as extraConfig, in same directory
 * And create a mixin between baseConfig and extraConfig
 */
try {
  let extraBaseConfig = require(`./${configName}_extra`)
  baseConfig = Object.assign({}, baseConfig, extraBaseConfig)
  console.log(`config ${configName} is mixed`)
} catch (error) { }

module.exports = baseConfig
