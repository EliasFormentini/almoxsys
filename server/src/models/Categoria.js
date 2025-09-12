const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Categoria", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: "Categorias",
    timestamps: false,
  });
};
