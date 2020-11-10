"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("UserRoles", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {         // item belongsTo Invoice  1:1
          model: 'Roles',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {         // item belongsTo Invoice  1:1
          model: 'Users',
          key: 'id'
        }
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return queryInterface.dropTable("UserRoles");
  },
};
