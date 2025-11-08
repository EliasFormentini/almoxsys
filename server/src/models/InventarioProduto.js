// src/models/InventarioProduto.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const InventarioProduto = sequelize.define(
    "InventarioProduto",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_inventario: { type: DataTypes.INTEGER, allowNull: false },
      id_produto: { type: DataTypes.INTEGER, allowNull: false },
      qtd_correta: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      tableName: "inventario_produtos",
      timestamps: false,
    }
  );

  InventarioProduto.associate = (models) => {
    InventarioProduto.belongsTo(models.Inventario, {
      as: "inventario",
      foreignKey: "id_inventario",
    });
    InventarioProduto.belongsTo(models.Produto, {
      as: "produto",
      foreignKey: "id_produto",
    });
  };

  return InventarioProduto;
};
