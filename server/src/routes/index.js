const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const categoriaRoutes = require("./categoriaRoutes");
const unidadeRoutes = require("./unidadeRoutes");
const produtoRoutes = require("./produtoRoutes");
const fornecedorRoutes = require("./fornecedorRoutes");
const movimentacaoRoutes = require("./movimentacaoRoutes");
const inventarioRoutes = require("./inventarioRoutes");
const deckPermissaoRoutes = require("./deckPermissaoRoutes");

// ROTAS DE AUTENTICAÇÃO
router.use("/auth", authRoutes);

router.use("/categorias", categoriaRoutes);
router.use("/unidades", unidadeRoutes);
router.use("/produtos", produtoRoutes);
router.use("/fornecedores", fornecedorRoutes);
router.use("/movimentacoes", movimentacaoRoutes);
router.use("/inventario", inventarioRoutes);
router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/decks-permissao", deckPermissaoRoutes);

module.exports = router;
