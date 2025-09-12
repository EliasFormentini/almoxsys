"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pedidos", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tipo: { type: Sequelize.ENUM("retirada", "compra"), allowNull: false },
      status: { 
        type: Sequelize.ENUM("pendente", "aprovado", "rejeitado", "atendido"), 
        defaultValue: "pendente" 
      },
      data_pedido: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: { model: "Usuarios", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      valor_total: { type: Sequelize.DECIMAL(10,2), defaultValue: 0.00 }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Pedidos");
  }
};
