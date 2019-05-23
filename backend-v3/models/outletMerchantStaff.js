'use strict'

module.exports = (sequelize, DataTypes) => {
  let outletMerchantStaff = sequelize.define('outletMerchantStaff', {
    outletId: DataTypes.INTEGER,
    merchantStaffId: DataTypes.INTEGER
  }, {
    timestamps: true,
    freezeTableName: true,
    paranoid: false
  })

  outletMerchantStaff.associate = (models) => {
    outletMerchantStaff.belongsTo(models.outlet, { foreignKey: 'outletId' })
    outletMerchantStaff.belongsTo(models.merchantStaff, { foreignKey: 'merchantStaffId' })
  }

  return outletMerchantStaff
}
