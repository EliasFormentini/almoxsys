const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Pedido", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo: { type: DataTypes.ENUM("retirada", "compra"), allowNull: false },
    status: { 
      type: DataTypes.ENUM("pendente", "aprovado", "rejeitado", "atendido"), 
      defaultValue: "pendente" 
    },
    data_pedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    valor_total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 }
  }, {
    tableName: "Pedidos",
    timestamps: false,
  });
};
