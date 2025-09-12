const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Fornecedor", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: true },
    telefone: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: "Fornecedores",
    timestamps: false,
  });
};
