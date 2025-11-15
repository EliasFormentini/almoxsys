// const { Router } = require("express");

// const authRoutes = require("./authRoutes");
// const usuarioRoutes = require("./usuarioRoutes");
// const produtoRoutes = require("./produtoRoutes");
// const pedidoRoutes = require("./pedidoRoutes");
// const categoriaRoutes = require("./categoriaRoutes");
// const unidadeRoutes = require("./unidadeRoutes");
// const movimentacaoRoutes = require("./movimentacaoRoutes");
// const fornecedorRoutes = require("./fornecedorRoutes");
// const inventarioRoutes = require("./inventarioRoutes");

// const router = Router();


// // Agrupamento de rotas
// router.use("/auth", authRoutes);
// router.use("/usuarios", usuarioRoutes);
// router.use("/produtos", produtoRoutes);
// router.use("/pedidos", pedidoRoutes);
// router.use("/categorias", categoriaRoutes);
// router.use("/unidades", unidadeRoutes);
// router.use("/movimentacoes", movimentacaoRoutes);
// router.use("/fornecedores", fornecedorRoutes);
// router.use("/inventario", inventarioRoutes);

// module.exports = router;


// src/routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const categoriaRoutes = require("./categoriaRoutes");
const unidadeRoutes = require("./unidadeRoutes");
const produtoRoutes = require("./produtoRoutes");
const fornecedorRoutes = require("./fornecedorRoutes");
const movimentacaoRoutes = require("./movimentacaoRoutes");
const inventarioRoutes = require("./inventarioRoutes");

// ROTAS DE AUTENTICAÇÃO
router.use("/auth", authRoutes);

// DEMAIS ROTAS
router.use("/categorias", categoriaRoutes);
router.use("/unidades", unidadeRoutes);
router.use("/produtos", produtoRoutes);
router.use("/fornecedores", fornecedorRoutes);
router.use("/movimentacoes", movimentacaoRoutes);
router.use("/inventario", inventarioRoutes);

module.exports = router;
