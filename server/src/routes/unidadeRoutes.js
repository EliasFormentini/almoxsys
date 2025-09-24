const { Router } = require("express");
const unidadeController = require("../controllers/unidadeController");

const router = Router();

router.get("/", unidadeController.listar);
router.get("/:id", unidadeController.buscarPorId);
router.post("/", unidadeController.criar);
router.put("/:id", unidadeController.atualizar);
router.delete("/:id", unidadeController.deletar);

module.exports = router;
