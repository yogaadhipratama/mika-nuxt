'use strict'

const msgFactory = require('../helpers/msgFactory')
const cipherbox = require('../helpers/cipherbox')
const models = require('../models')

const debug = {
  processCipherbox: require('debug')('cipherboxMiddleware:processCipherbox')
}

/**
 * Middleware to transparently encrypt and decrypt any supported cipherbox.
 *
 * Warning: This middleware hijack `res.send` function
*/
module.exports.processCipherbox = async function (req, res, next) {
  if (req.body.cbx && req.body.id) {
    debug.processCipherbox('detected')
    let cipherboxKey = await models.cipherboxKey.findOne({
      where: {
        idKey: req.body.id
      }
    })
    if (cipherboxKey) {
      debug.processCipherbox(`key id ${cipherboxKey.idKey}, unsealing`)
      let keys = JSON.parse(cipherboxKey.keys)
      let unbox = null

      if (keys.cbx === cipherbox.cbType.cb0) {
        debug.processCipherbox('type cb0')
        unbox = cipherbox.openCB0Box(req.body, Buffer.from(keys.key, 'base64'))
      } else if (keys.cbx === cipherbox.cbType.cb1) {
        debug.processCipherbox('type cb1')
        unbox = cipherbox.openCB1Box(req.body, keys.key, keys.keyType)
      } else if (keys.cbx === cipherbox.cbType.cb3) {
        debug.processCipherbox('type cb3')
        unbox = cipherbox.openCB3Box(req.body, Buffer.from(keys.key, 'base64'))
      }

      if (!unbox) {
        debug.processCipherbox('unsealing failed')
        msgFactory.expressCreateResponse(
          res,
          msgFactory.msgTypes.MSG_ERROR_INVALID_CIPHERBOX
        )
        return
      }

      req.cipherbox = {
        cipherboxKeyId: cipherboxKey.id,
        terminalId: cipherboxKey.terminalId
      }

      // We assume body is JSON, finger cross
      // if its not, just convert to string
      try {
        req.body = JSON.parse(unbox.data)
      } catch (error) {
        req.body = unbox.data.toString()
      }

      debug.processCipherbox('unseal done')

      // Hijack send function
      let send = res.send
      res.send = (body) => {
        debug.processCipherbox('sealing reply')
        if (typeof body === 'object') {
          body = cipherbox.sealBoxWithCB0(JSON.stringify(body), unbox.key).box
        } else {
          body = cipherbox.sealBoxWithCB0(String(body), unbox.key).box
        }

        debug.processCipherbox('sealing reply done')

        res.send = send
        return res.send(body)
      }
    }
  }

  next()
}