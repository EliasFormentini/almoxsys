// src/models/Inventario.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Inventario = sequelize.define(
    "Inventario",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      data_abertura: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      inventario_concluido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Inventarios",
      timestamps: false,
    }
  );

  Inventario.associate = (models) => {
    Inventario.hasMany(models.InventarioProduto, {
      as: "itens",
      foreignKey: "id_inventario",
    });
  };

  return Inventario;
};
