'use strict'

const models = require('../models')
const alto = require('../helpers/ppAlto')

module.exports.queryTransaction = async (req, res, next) => {
  let response = {}

  let paymentProviderConfig = models.paymentProviderConfig.findOne({
    where: {
      id: req.body.paymentProviderConfigId
    },
    attributes: ['config']
  }) || { config: {} }

  response.payQuery = await alto.altoQueryPayment(Object.assign({
    out_trade_no: req.body.out_trade_no
  }, paymentProviderConfig.config))

  if (req.body.out_refund_no) {
    response.refundQuery = await alto.altoQueryRefundPayment(Object.assign({
      out_trade_no: req.body.id,
      out_refund_no: req.body.out_refund_no
    }, paymentProviderConfig.config))
  }

  res.send(response)
}
