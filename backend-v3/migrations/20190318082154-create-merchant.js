'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('merchant', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },

      companyForm: {
        type: Sequelize.STRING
      },

      email: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      streetAddress: {
        type: Sequelize.STRING
      },
      locality: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      postalCode: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },

      idTaxCard: {
        type: Sequelize.STRING
      },
      scannedTaxCardResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },

      bankName: {
        type: Sequelize.STRING
      },
      bankBranchName: {
        type: Sequelize.STRING
      },
      bankAccountName: {
        type: Sequelize.STRING
      },
      bankAccountNumber: {
        type: Sequelize.STRING
      },

      scannedBankStatementResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },
      scannedSkmenkumhamResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },
      scannedSiupResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },
      scannedTdpResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },
      scannedSkdpResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },

      ownerName: {
        type: Sequelize.STRING
      },
      ownerOccupation: {
        type: Sequelize.STRING
      },
      ownerEmail: {
        type: Sequelize.STRING
      },
      ownerPhoneNumber: {
        type: Sequelize.STRING
      },
      ownerIdCardNumber: {
        type: Sequelize.STRING
      },
      ownerIdCardType: {
        type: Sequelize.STRING
      },
      ownerTaxCardNumber: {
        type: Sequelize.STRING
      },
      ownerScannedIdCardResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },
      ownerScannedTaxCardResourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'resource',
          key: 'id'
        }
      },

      partnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'partner',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('merchant')
  }
}