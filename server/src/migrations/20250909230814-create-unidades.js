"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Unidades", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      descricao: { type: Sequelize.STRING, allowNull: false },
      sigla: { type: Sequelize.STRING(10), allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Unidades");
  }
};
