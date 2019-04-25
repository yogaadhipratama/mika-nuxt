'use strict'

const extApiAuth = require('../helpers/extApiAuth')

module.exports.extApiAuth = async (req, res, next) => {
  req.auth = null
  try {
    let authComponent = req.headers['authorization'].split(' ')
    if (authComponent[0].toLowerCase() === 'bearer') {
      req.auth = await extApiAuth.verifyClientToken(authComponent[1])
    }
  } catch (err) {
    console.error(err)
  }
  next()
}
