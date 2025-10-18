"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Produtos", [
      {
        nome: "Queijo Mussarela",
        descricao: "Queijo artesanal de leite integral",
        id_categoria: 50,
        id_unidade: 17,
        estoque_atual: 25,
        estoque_minimo: 10,
        status: "A",
      },
      {
        nome: "Molho de Tomate",
        descricao: "Molho natural sem conservantes",
        id_categoria: 50,
        id_unidade: 18,
        estoque_atual: 0,
        estoque_minimo: 5,
        status: "A",
      },
      {
        nome: "Massa Fresca",
        descricao: "Tagliatelle artesanal feita com ovos caipiras",
        id_categoria: 51,
        id_unidade: 19,
        estoque_atual: 8,
        estoque_minimo: 10,
        status: "A",
      },
      {
        nome: "Azeite Italiano",
        descricao: "Azeite extravirgem importado da Toscana",
        id_categoria: 52,
        id_unidade: 19,
        estoque_atual: 15,
        estoque_minimo: 5,
        status: "I",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Produtos", null, {});
  },
};
