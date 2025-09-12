const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("ItemPedido", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_pedido: { type: DataTypes.INTEGER },
    id_produto: { type: DataTypes.INTEGER },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    valor_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    valor_total: { type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    tableName: "Itens_pedido",
    timestamps: false
  });
};
