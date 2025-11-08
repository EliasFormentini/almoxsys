"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Movimentacoes", "observacao", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "data_movimentacao", // opcional, depende do banco
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Movimentacoes", "observacao");
  },
};
