"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Unidades", [
      { descricao: "Unidade", sigla: "UN" },
      { descricao: "Caixa", sigla: "CX" },
      { descricao: "Pacote", sigla: "PC" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Unidades", null, {});
  },
};
 