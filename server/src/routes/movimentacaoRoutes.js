const { Router } = require("express");
const movimentacaoController = require("../controllers/movimentacaoController");
const authMiddleware = require("../middlewares/authMiddleware");
const permission = require("../middlewares/permissionMiddleware");

const router = Router();

router.use(authMiddleware);
router.use(permission("MOVIMENTACOES"));

router.get("/", movimentacaoController.list);
router.get("/:id", movimentacaoController.getById);
router.post("/", movimentacaoController.create);
router.post("/entradas", movimentacaoController.createEntrada); 

module.exports = router;
