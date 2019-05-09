'use strict'

const trxManager = require('../helpers/trxManager')
const msgFactory = require('../helpers/msgFactory')
const auth = require('../helpers/auth')

/**
 * List all enumeration types in mika system
 */
module.exports.listTypes = async (req, res, next) => {
  msgFactory.expressCreateResponse(
    res,
    msgFactory.msgTypes.MSG_SUCCESS,
    {
      trxManager: trxManager.types,
      msgFactory: msgFactory.types,
      authTypes: {
        userRoles: auth.userRoles,
        userTypes: auth.userTypes
      }
    }
  )
}