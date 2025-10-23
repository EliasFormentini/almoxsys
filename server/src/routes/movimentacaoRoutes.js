const { Router } = require("express");
const movimentacaoController = require("../controllers/movimentacaoController");

const router = Router();

router.get("/", movimentacaoController.list);
router.get("/:id", movimentacaoController.getById);
router.post("/", movimentacaoController.create);
router.post("/entradas", movimentacaoController.createEntrada); 

module.exports = router;
