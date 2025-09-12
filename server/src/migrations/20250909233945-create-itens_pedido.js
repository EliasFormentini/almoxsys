"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Itens_pedido", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      id_pedido: {
        type: Sequelize.INTEGER,
        references: { model: "Pedidos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_produto: {
        type: Sequelize.INTEGER,
        references: { model: "Produtos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      quantidade: { type: Sequelize.INTEGER, allowNull: false },
      valor_unitario: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      valor_total: { type: Sequelize.DECIMAL(10,2), allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Itens_pedido");
  }
};
