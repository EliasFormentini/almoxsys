"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categorias", [
      { nome: "Gêneros Alimentícios" },
      { nome: "Material de Limpeza" },
      { nome: "Material de Expediente" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categorias", null, {});
  },
};
