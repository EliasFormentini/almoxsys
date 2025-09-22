const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");


// importa os models e injeta a instância do sequelize
const Usuario = require("./usuario")(sequelize);
const Unidade = require("./unidade")(sequelize);
const Categoria = require("./categoria")(sequelize);
const Produto = require("./produto")(sequelize);
const Pedido = require("./pedido")(sequelize);
const ItemPedido = require("./ItemPedido")(sequelize);
const Movimentacao = require("./movimentacao")(sequelize);
const Fornecedor = require("./fornecedor")(sequelize);

// ========================
// ASSOCIAÇÕES
// ========================

// Produto pertence a uma Categoria e uma Unidade
Produto.belongsTo(Categoria, { foreignKey: "id_categoria", as: "categoria" });
Categoria.hasMany(Produto, { foreignKey: "id_categoria", as: "produtos" });

Produto.belongsTo(Unidade, { foreignKey: "id_unidade", as: "unidade" });
Unidade.hasMany(Produto, { foreignKey: "id_unidade", as: "produtos" });

// Pedido pertence a um Usuário
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Pedido, { foreignKey: "id_usuario", as: "pedidos" });

// Pedido tem vários ItensPedido
Pedido.hasMany(ItemPedido, { foreignKey: "id_pedido", as: "itens" });
ItemPedido.belongsTo(Pedido, { foreignKey: "id_pedido", as: "pedido" });

// ItemPedido pertence a um Produto
ItemPedido.belongsTo(Produto, { foreignKey: "id_produto", as: "produto" });
Produto.hasMany(ItemPedido, { foreignKey: "id_produto", as: "itensPedido" });

// Movimentação pertence a Produto
Movimentacao.belongsTo(Produto, { foreignKey: "id_produto", as: "produto" });
Produto.hasMany(Movimentacao, { foreignKey: "id_produto", as: "movimentacoes" });

// Movimentação pertence a Usuário
Movimentacao.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Movimentacao, { foreignKey: "id_usuario", as: "movimentacoes" });

// Movimentação pode estar ligada a um Pedido
Movimentacao.belongsTo(Pedido, { foreignKey: "id_pedido", as: "pedido" });
Pedido.hasMany(Movimentacao, { foreignKey: "id_pedido", as: "movimentacoes" });

// Movimentação pertence a um Fornecedor (opcional)
Movimentacao.belongsTo(Fornecedor, { foreignKey: "id_fornecedor", as: "fornecedor" });
Fornecedor.hasMany(Movimentacao, { foreignKey: "id_fornecedor", as: "movimentacoes" });

// Exporta models + conexão
module.exports = {
  sequelize,
  Usuario,
  Unidade,
  Categoria,
  Produto,
  Pedido,
  ItemPedido,
  Movimentacao,
  Fornecedor,
}