const { Router } = require("express");
const categoriaController = require("../controllers/categoriaController");

const router = Router();

router.get("/", categoriaController.listar);
router.get("/:id", categoriaController.buscarPorId);
router.post("/", categoriaController.criar);
router.put("/:id", categoriaController.atualizar);
router.delete("/:id", categoriaController.deletar);

module.exports = router;
