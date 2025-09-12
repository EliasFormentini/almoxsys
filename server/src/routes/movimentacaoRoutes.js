const { Router } = require("express");
const movimentacaoController = require("../controllers/movimentacaoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.use(authMiddleware);

// Listar movimentações (opcional filtro por tipo, produto ou usuário)
router.get("/", movimentacaoController.list);

// Criar movimentação
router.post("/", movimentacaoController.create);

// Buscar movimentação por ID
router.get("/:id", movimentacaoController.getById);

module.exports = router;
