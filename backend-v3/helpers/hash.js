'use strict'

/**
 * Encapsulate hash implementation
 */

const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports.hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex')
}

module.exports.bcryptHash = async (data) => {
  return bcrypt.hash(data, bcrypt.genSaltSync(10))
}

module.exports.compareBcryptHash = async (dataHashed, data) => {
  return bcrypt.compare(data, dataHashed)
}

module.exports.compareString = (dataA, dataB) => {
  crypto.timingSafeEqual(Buffer.from(dataA), Buffer.from(dataB))
}

module.exports.compareHash = (dataHashed, data) => {
  let dataHashA = crypto.createHash('sha256').update(data).digest()
  let dataHashB = Buffer.from(dataHashed, 'hex')
  return crypto.timingSafeEqual(dataHashA, dataHashB)
}