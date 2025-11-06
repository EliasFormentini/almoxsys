const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Produto", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT },
    id_categoria: { type: DataTypes.INTEGER },
    id_unidade: { type: DataTypes.INTEGER },
    estoque_atual: { type: DataTypes.INTEGER, defaultValue: 0 },
    estoque_minimo: { type: DataTypes.INTEGER, defaultValue: 0 },
    custo_medio: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: { type: DataTypes.ENUM("A", "I"), defaultValue: "A" },
  }, {
    tableName: "Produtos",
    timestamps: false, 
  });
};
