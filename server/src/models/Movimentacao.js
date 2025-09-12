const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Movimentacao = sequelize.define("Movimentacao", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo: { type: DataTypes.ENUM("entrada", "saida"), allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    valor_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    valor_total: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    numero_nota: { type: DataTypes.STRING, allowNull: true },
    serie_nota: { type: DataTypes.STRING, allowNull: true },
    id_fornecedor: { type: DataTypes.INTEGER, allowNull: true },
    id_produto: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    id_pedido: { type: DataTypes.INTEGER, allowNull: true },
    data_movimentacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: "Movimentacoes",
    timestamps: false,
  });

  // Hook para calcular valor_total automaticamente
  Movimentacao.beforeCreate((mov) => {
    if (mov.quantidade && mov.valor_unitario) {
      mov.valor_total = mov.quantidade * mov.valor_unitario;
    }
  });

  Movimentacao.beforeUpdate((mov) => {
    if (mov.quantidade && mov.valor_unitario) {
      mov.valor_total = mov.quantidade * mov.valor_unitario;
    }
  });

  return Movimentacao;
};
