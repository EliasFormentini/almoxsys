"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Fornecedores", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.STRING, allowNull: false },
      cnpj: { type: Sequelize.STRING, allowNull: true },
      telefone: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Fornecedores");
  }
};
