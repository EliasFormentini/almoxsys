const { Router } = require("express");
const unidadeController = require("../controllers/unidadeController");
const authMiddleware = require("../middlewares/authMiddleware");
const permission = require("../middlewares/permissionMiddleware");
const router = Router();

router.use(authMiddleware);
router.use(permission("PRODUTOS"));

router.get("/", unidadeController.listar);
router.get("/:id", unidadeController.buscarPorId);
router.post("/", unidadeController.criar);
router.put("/:id", unidadeController.atualizar);
router.delete("/:id", unidadeController.deletar);

module.exports = router;
