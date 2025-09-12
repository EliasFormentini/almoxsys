const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Unidade", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sigla: { type: DataTypes.STRING(10), allowNull: false },
    descricao: { type: DataTypes.STRING(50), allowNull: true },
  }, {
    tableName: "Unidades",
    timestamps: false,
  });
};
