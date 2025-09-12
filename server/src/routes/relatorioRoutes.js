const { Router } = require("express");
const relatorioController = require("../controllers/relatorioController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();
router.use(authMiddleware);

// Movimentações por período
router.get("/movimentacoes", relatorioController.movimentacoesPorPeriodo);

// Estoque atual
router.get("/estoque", relatorioController.estoqueAtual);

module.exports = router;
