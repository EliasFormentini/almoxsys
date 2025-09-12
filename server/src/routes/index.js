const { Router } = require("express");
const usuarioRoutes = require("./usuarioRoutes");
const produtoRoutes = require("./produtoRoutes");
const pedidoRoutes = require("./pedidoRoutes");
const movimentacaoRoutes = require("./movimentacaoRoutes");
const relatorioRoutes = require("./relatorioRoutes");

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API do Almoxarifado funcionando 🚀" });
});

router.use("/usuarios", usuarioRoutes);
router.use("/produtos", produtoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/movimentacoes", movimentacaoRoutes);
router.use("/relatorios", relatorioRoutes);

module.exports = router;
