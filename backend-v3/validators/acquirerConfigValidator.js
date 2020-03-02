'use strict'

const _ = require('lodash')

const { body } = require('express-validator')

const helper = require('./helper')

const handlerValidator = () => body('handler').not().isEmpty()
const nameValidator = () => body('name').not().isEmpty()
const configValidator = () => body('config').custom((config) => _.isPlainObject(config))
const merchantIdValidator = () => body('merchantId').isInt()

const defaultValidator = [
  helper.archivedAtValidator,
  configValidator().optional(),
  merchantIdValidator().optional({ nullable: true })
]

module.exports.bodyCreate = [
  defaultValidator,
  handlerValidator(),
  nameValidator()
]

module.exports.bodyUpdate = [
  defaultValidator,
  handlerValidator().optional(),
  nameValidator().optional()
]
