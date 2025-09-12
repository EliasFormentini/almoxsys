"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categorias", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.STRING, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Categorias");
  }
};
