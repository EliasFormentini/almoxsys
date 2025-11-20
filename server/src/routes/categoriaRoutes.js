const { Router } = require("express");
const categoriaController = require("../controllers/categoriaController");
const authMiddleware = require("../middlewares/authMiddleware");
const permission = require("../middlewares/permissionMiddleware");
const router = Router();

router.use(authMiddleware);
router.use(permission("PRODUTOS"));

router.get("/", categoriaController.listar);
router.get("/:id", categoriaController.buscarPorId);
router.post("/", categoriaController.criar);
router.put("/:id", categoriaController.atualizar);
router.delete("/:id", categoriaController.deletar);

module.exports = router;
