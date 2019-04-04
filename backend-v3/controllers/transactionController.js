'use strict'

const msgFactory = require('../helpers/msgFactory')
const trxManager = require('../helpers/trxManager')
const auth = require('../helpers/auth')

const models = require('../models')

/**
 * Create new transaction by agent
 */
module.exports.newTransaction = async (req, res, next) => {
  const options = {
    ipAddress: req.ip
  }

  if (req.auth.terminalId) {
    options.terminalId = req.auth.terminalId
  }

  if (req.body.userToken && req.body.userTokenType) {
    options.userToken = req.body.userToken
    options.userTokenType = req.body.userTokenType
  }

  if (req.body.flags) {
    options.flags = req.body.flags
  }

  const newTransaction = await trxManager.newTransaction(
    req.body.amount,
    req.body.paymentProviderId,
    req.auth.agentId,
    options
  )

  // translate error message
  if (newTransaction.error) {
    if (newTransaction.error === trxManager.errorCodes.AMOUNT_TOO_LOW) {
      msgFactory.expressCreateResponseMessage(
        res,
        msgFactory.messageTypes.MSG_ERROR_AMOUNT_TOO_LOW
      )
    } else if (newTransaction.error === trxManager.errorCodes.AMOUNT_TOO_HIGH) {
      msgFactory.expressCreateResponseMessage(
        res,
        msgFactory.messageTypes.MSG_ERROR_AMOUNT_TOO_HIGH
      )
    } else if (newTransaction.error === trxManager.errorCodes.NEED_USER_TOKEN) {
      msgFactory.expressCreateResponseMessage(
        res,
        msgFactory.messageTypes.MSG_ERROR_NEED_USER_TOKEN
      )
    } else if (newTransaction.error === trxManager.errorCodes.PAYMENT_PROVIDER_NOT_FOR_YOU) {
      msgFactory.expressCreateResponseMessage(
        res,
        msgFactory.messageTypes.MSG_ERROR_PAYMENT_PROVIDER_NOT_FOR_YOU
      )
    } else {
      msgFactory.expressCreateResponseMessage(
        res,
        msgFactory.messageTypes.MSG_ERROR_CANNOT_CREATE_TRANSACTION,
        newTransaction
      )
    }
  }

  msgFactory.expressCreateResponseMessage(
    res,
    msgFactory.messageTypes.MSG_SUCCESS_TRANSACTION_CREATED,
    newTransaction
  )
}

/**
 * Post-action transaction
 */
module.exports.postTransaction = async (req, res, next) => {
}

/**
 * Get one or many transactions (dependent with `req.auth.userType`)
 */
module.exports.getTransactions = async (req, res, next) => {
  if (req.auth.userType === auth.userTypes.AGENT) {
    let query = Object.assign({
      where: {
        agentId: req.auth.agentId
      },
      attributes: { exclude: ['deletedAt'] },
      include: [
        {
          model: models.paymentProvider,
          attributes: {
            exclude: [
              'shareMerchant',
              'shareMerchantWithPartner',
              'sharePartner',
              'directSettlement',
              'createdAt',
              'updatedAt',
              'deletedAt'
            ]
          },
          include: [
            {
              model: models.paymentProviderType,
              attributes: {
                exclude: [
                  'createdAt',
                  'updatedAt',
                  'deletedAt'
                ]
              }
            },
            {
              model: models.paymentProviderConfig,
              attributes: {
                exclude: [
                  'config',
                  'providerIdReference',
                  'providerIdType',
                  'createdAt',
                  'updatedAt',
                  'deletedAt'
                ]
              }
            }
          ]
        }
      ]
    })

    if (req.params.id) {
      query.where.id = req.params.id

      let transaction = await models.transaction.findOne(query)
      if (transaction) {
        msgFactory.expressCreateResponseMessage(
          res,
          msgFactory.messageTypes.MSG_SUCCESS_ENTITY_RETRIEVED,
          transaction
        )
      } else {
        msgFactory.expressCreateResponseMessage(
          res,
          msgFactory.messageTypes.MSG_ERROR_ENTITY_NOT_FOUND,
          transaction
        )
      }
    } else {
      let transactions = await models.transaction.findAndCountAll(Object.assign(query, req.sequelizePagination))
      msgFactory.expressCreateResponseMessage(
        res,
        msgFactory.messageTypes.MSG_SUCCESS_ENTITY_RETRIEVED,
        transactions.rows,
        msgFactory.createPaginationMeta(req.page, req.per_page, transactions.count)
      )
    }
  } else if (req.auth.userType === auth.userTypes.MERCHANT) {
    msgFactory.expressCreateResponseMessage(
      res,
      msgFactory.messageTypes.MSG_ERROR_NOT_IMPLEMENTED
    )
  } else if (req.auth.userType === auth.userTypes.ADMIN) {
    msgFactory.expressCreateResponseMessage(
      res,
      msgFactory.messageTypes.MSG_ERROR_NOT_IMPLEMENTED
    )
  } else {
    throw new Error('Cannot get transaction(s) req.auth.userType is not valid')
  }
}
