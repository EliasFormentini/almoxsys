const { Router } = require("express");
const fornecedorController = require("../controllers/fornecedorController");
const authMiddleware = require("../middlewares/authMiddleware");
const permission = require("../middlewares/permissionMiddleware");


const router = Router();

router.use(authMiddleware);
router.use(permission("FORNECEDORES"));

router.get("/", fornecedorController.listar);
router.get("/:id", fornecedorController.buscarPorId);
router.post("/", fornecedorController.criar);
router.put("/:id", fornecedorController.atualizar);
router.delete("/:id", fornecedorController.deletar);

module.exports = router;


