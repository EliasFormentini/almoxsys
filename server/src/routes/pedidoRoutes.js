const { Router } = require("express");
const pedidoController = require("../controllers/pedidoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.use(authMiddleware);

// Listar pedidos
router.get("/", pedidoController.list);

// Criar pedido
router.post("/", pedidoController.create);

// Obter pedido por ID
router.get("/:id", pedidoController.getById);

// Aprovar/Rejeitar pedido
router.put("/:id/status", pedidoController.updateStatus);

module.exports = router;
