const { Router } = require("express");
const movimentacaoController = require("../controllers/movimentacaoController");

const router = Router();

// LISTAR todas as movimentações (usado para entradas)
router.get("/", movimentacaoController.list);

// BUSCAR movimentação por ID
router.get("/:id", movimentacaoController.getById);

// CRIAR nova movimentação (entrada ou saída)
router.post("/", movimentacaoController.create);

module.exports = router;
