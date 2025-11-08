"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Inventarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      data_abertura: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      inventario_concluido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // opcional: quem abriu, observação, etc depois
      // id_usuario: { ... }
      // observacao: { type: Sequelize.TEXT, allowNull: true }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Inventarios");
  },
};
