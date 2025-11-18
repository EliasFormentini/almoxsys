"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DecksPermissao", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      // aqui vamos guardar as permissões em JSON (string)
      permissoes: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "[]", // JSON de array
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("DecksPermissao");
  },
};
