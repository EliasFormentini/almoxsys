const sequelize = require("../config/database");

// importa os models e injeta a instância do sequelize
const Usuario = require("./usuario")(sequelize);
const Unidade = require("./unidade")(sequelize);
const Categoria = require("./categoria")(sequelize);
const Produto = require("./produto")(sequelize);
const Pedido = require("./pedido")(sequelize);
const ItemPedido = require("./ItemPedido")(sequelize);
const Movimentacao = require("./movimentacao")(sequelize);
const Fornecedor = require("./fornecedor")(sequelize);

// 👇 novos models corretos
const Inventario = require("./Inventario")(sequelize);
const InventarioProduto = require("./InventarioProduto")(sequelize);

// ========================
// ASSOCIAÇÕES
// ========================

// Produto x Categoria
Produto.belongsTo(Categoria, { foreignKey: "id_categoria", as: "categoria" });
Categoria.hasMany(Produto, { foreignKey: "id_categoria", as: "produtos" });

// Produto x Unidade
Produto.belongsTo(Unidade, { foreignKey: "id_unidade", as: "unidade" });
Unidade.hasMany(Produto, { foreignKey: "id_unidade", as: "produtos" });

// Pedido x Usuario
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Pedido, { foreignKey: "id_usuario", as: "pedidos" });

// Pedido x Itens
Pedido.hasMany(ItemPedido, { foreignKey: "id_pedido", as: "itens" });
ItemPedido.belongsTo(Pedido, { foreignKey: "id_pedido", as: "pedido" });

// ItemPedido x Produto
ItemPedido.belongsTo(Produto, { foreignKey: "id_produto", as: "produto" });
Produto.hasMany(ItemPedido, { foreignKey: "id_produto", as: "itensPedido" });

// Movimentacao x Produto
Movimentacao.belongsTo(Produto, { foreignKey: "id_produto", as: "produto" });
Produto.hasMany(Movimentacao, { foreignKey: "id_produto", as: "movimentacoes" });

// Movimentacao x Usuario
Movimentacao.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Movimentacao, { foreignKey: "id_usuario", as: "movimentacoes" });

// Movimentacao x Pedido
Movimentacao.belongsTo(Pedido, { foreignKey: "id_pedido", as: "pedido" });
Pedido.hasMany(Movimentacao, { foreignKey: "id_pedido", as: "movimentacoes" });

// Movimentacao x Fornecedor
Movimentacao.belongsTo(Fornecedor, { foreignKey: "id_fornecedor", as: "fornecedor" });
Fornecedor.hasMany(Movimentacao, { foreignKey: "id_fornecedor", as: "movimentacoes" });

// ========================
// Inventário (cabeçalho + itens)
// ========================

// Inventario x InventarioProduto
Inventario.hasMany(InventarioProduto, {
  as: "itens",
  foreignKey: "id_inventario",
});
InventarioProduto.belongsTo(Inventario, {
  as: "inventario",
  foreignKey: "id_inventario",
});

// InventarioProduto x Produto
InventarioProduto.belongsTo(Produto, {
  as: "produto",
  foreignKey: "id_produto",
});
Produto.hasMany(InventarioProduto, {
  as: "inventariosProduto",
  foreignKey: "id_produto",
});

// ========================

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
  Inventario,
  InventarioProduto,
};
