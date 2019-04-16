'use strict'

/**
 * Internal API auth implementation
 */

const redis = require('./redis')
const hash = require('./hash')
const models = require('../models')
const jwt = require('jsonwebtoken')

const notif = require('../helpers/notif')

const appConfig = require('../configs/appConfig')

module.exports.userTypes = {
  ADMIN: 'admin',
  AGENT: 'agent',
  MERCHANT_STAFF: 'merchantStaff',
  PARTNER_STAFF: 'partnerStaff',
  PAYMENT_PROVIDER_STAFF: 'paymentProviderStaff'
}

module.exports.userRoles = {
  ADMIN_FINANCE: 'adminFinance',
  ADMIN_HR: 'adminHr',
  ADMIN_MARKETING: 'adminMarketing',
  ADMIN_SUPPORT: 'adminSupport',
  ADMIN_LOGISTIC: 'adminLogistic'
}

function redisKey (key) {
  return `auth:${key}`
}

module.exports.setSessionToken = async (userId, sessionKey, expirySecond) => {
  return redis.setex(
    redisKey(userId),
    expirySecond,
    sessionKey
  )
}

module.exports.refreshSessionToken = async (userId, expirySecond) => {
  return redis.expire(
    redisKey(userId),
    expirySecond)
}

module.exports.getSessionToken = async (userId) => {
  return redis.get(redisKey(userId))
}

module.exports.deleteSessionToken = async (userId) => {
  await redis.del(redisKey(userId))
}

module.exports.generateToken = (payload, secretKey = appConfig.authSecretKey) => {
  return jwt.sign(payload, secretKey)
}

module.exports.verifyToken = (sessionToken, secretKey = appConfig.authSecretKey) => {
  try {
    let payload = jwt.verify(sessionToken, secretKey)
    if (payload) {
      return payload
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * Do authentication
 */
module.exports.doAuth = async function (username, password, options = {}) {
  if (!username || !password) {
    return
  }

  let user = await models.user.findOne({
    where: {
      username: username
    }
  })

  if (!user) return

  if (!await hash.compareBcryptHash(user.password, password)) return

  if (Array.isArray(options.userTypes)) {
    if (!options.userTypes.includes(user.userType)) return
  }

  let authResult = {
    auth: {
      userId: user.id,
      username: user.username,
      userType: null,
      userRoles: typeof user.userRoles === 'string' ? user.userRoles.split(',') : []
    },
    sessionToken: null,
    authExpirySecond: appConfig.authExpirySecond
  }

  if (user.userType === exports.userTypes.ADMIN) {
    let admin = await models.admin.findOne({
      where: {
        userId: user.id
      },
      attributes: ['id']
    })

    if (admin) {
      authResult.auth.userType = exports.userTypes.ADMIN
      authResult.auth.adminId = admin.id
    }
  }

  if (user.userType === exports.userTypes.MERCHANT) {
    let merchant = await models.merchant.findOne({
      where: {
        userId: user.id
      },
      attributes: ['id']
    })

    if (merchant) {
      authResult.auth.userType = exports.userTypes.MERCHANT
      authResult.auth.merchantId = merchant.id
    }
  }

  if (user.userType === exports.userTypes.MERCHANT_STAFF) {
    let merchantStaff = await models.merchantStaff.findOne({
      where: {
        userId: user.id
      },
      attributes: ['id']
    })

    if (merchantStaff) {
      authResult.auth.userType = exports.userTypes.MERCHANT_STAFF
      authResult.auth.merchantStaffId = merchantStaff.id
    }
  }

  if (user.userType === exports.userTypes.AGENT) {
    let agent = await models.agent.findOne({
      where: {
        userId: user.id
      },
      attributes: ['id', 'boundedToTerminal']
    })

    if (agent) {
      authResult.auth.userType = exports.userTypes.AGENT
      authResult.auth.agentId = agent.id
      authResult.auth.terminalId = null

      if (agent.boundedToTerminal) {
        if (!options.terminalId) return
        let agentTerminal = await models.agentTerminal.findOne({
          where: {
            terminalId: options.terminalId
          }
        })
        if (!agentTerminal) return
        authResult.auth.terminalId = agentTerminal.terminalId
      }
      authResult.brokerDetail = await notif.addAgent(agent.id, appConfig.authExpirySecond)
    }
  }

  if (authResult.auth.userType) {
    authResult.sessionToken = exports.generateToken(authResult.auth)
    await exports.setSessionToken(
      authResult.auth.userId,
      authResult.sessionToken,
      authResult.authExpirySecond
    )
    return authResult
  }
}

/**
 * Check auth session token
 */
module.exports.checkAuth = async (sessionToken) => {
  let auth = exports.verifyToken(sessionToken)

  if (auth) {
    if (await exports.getSessionToken(auth.userId) === sessionToken) {
      await exports.refreshSessionToken(auth.userId, appConfig.authExpirySecond)
      if (auth.userType === exports.userTypes.AGENT) {
        await notif.refreshAgent(auth.agentId, appConfig.authExpirySecond)
      }
      return auth
    }
  }
}

/**
 * Remove auth by token
 */
module.exports.removeAuth = async (sessionToken) => {
  let auth = exports.verifyToken(sessionToken)
  if (auth) {
    await exports.deleteSessionToken(auth.userId)
    if (auth.userType === exports.userTypes.AGENT) {
      await notif.removeAgent(auth.agentId)
    }
    return true
  }
}

/**
 * Change/reset current user password
 */
module.exports.resetAuth = async (userId, password, oldPassword = null) => {
  let user = await models.user.findOne({
    where: {
      id: userId
    }
  })

  if (user) {
    if (oldPassword) {
      if (!await hash.compareBcryptHash(user.password, oldPassword)) {
        return false
      }
    }

    let updated = await models.user.update(
      { password: await hash.bcryptHash(password) },
      { where: { id: userId } }
    )

    if (updated) {
      await exports.removeAuth(userId)
      return true
    }
  }
}
