const { Router } = require("express");
const fornecedorController = require("../controllers/fornecedorController");

const router = Router();

router.get("/", fornecedorController.listar);
router.get("/:id", fornecedorController.buscarPorId);
router.post("/", fornecedorController.criar);
router.put("/:id", fornecedorController.atualizar);
router.delete("/:id", fornecedorController.deletar);

module.exports = router;
