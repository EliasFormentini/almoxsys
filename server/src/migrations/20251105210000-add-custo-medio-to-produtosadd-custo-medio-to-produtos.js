"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Produtos", "custo_medio", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Produtos", "custo_medio");
  }
};
