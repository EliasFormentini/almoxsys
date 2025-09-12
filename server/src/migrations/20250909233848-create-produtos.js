"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Produtos", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.STRING, allowNull: false },
      descricao: { type: Sequelize.TEXT },
      id_categoria: {
        type: Sequelize.INTEGER,
        references: { model: "Categorias", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      id_unidade: {
        type: Sequelize.INTEGER,
        references: { model: "Unidades", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      estoque_atual: { type: Sequelize.INTEGER, defaultValue: 0 },
      estoque_minimo: { type: Sequelize.INTEGER, defaultValue: 0 },
      status: { type: Sequelize.ENUM("A","I"), defaultValue: "A", allowNull: false}
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Produtos");
  }
};
