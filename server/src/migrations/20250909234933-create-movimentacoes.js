"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Movimentacoes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tipo: { type: Sequelize.ENUM("entrada", "saida"), allowNull: false },
      id_produto: {
        type: Sequelize.INTEGER,
        references: { model: "Produtos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      quantidade: { type: Sequelize.INTEGER, allowNull: false },
      valor_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      valor_total: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      numero_nota: { type: Sequelize.STRING, allowNull: true },
      serie_nota: { type: Sequelize.STRING, allowNull: true },
      id_fornecedor: {
        type: Sequelize.INTEGER,
        references: { model: "Fornecedores", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: { model: "Usuarios", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      id_pedido: {
        type: Sequelize.INTEGER,
        references: { model: "Pedidos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      data_movimentacao: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Movimentacoes");
  }
};
