"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Usuarios", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false },
      perfil: { type: Sequelize.ENUM("administrador", "almoxarife", "funcionario"), allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Usuarios");
  }
};
