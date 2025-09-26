"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Fornecedores", [
      {
        nome: "Fornecedor A",
        cnpj: "11.111.111/0001-11",
        telefone: "(11) 99999-1111",
        email: "contato@fornecedorA.com",
      },
      {
        nome: "Fornecedor B",
        cnpj: "22.222.222/0001-22",
        telefone: "(21) 99999-2222",
        email: "contato@fornecedorB.com",
      },
      {
        nome: "Fornecedor C",
        cnpj: "33.333.333/0001-33",
        telefone: "(31) 99999-3333",
        email: "contato@fornecedorC.com",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Fornecedores", null, {});
  },
};
