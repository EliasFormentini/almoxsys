const { Router } = require("express");
const produtoController = require("../controllers/produtoController");

const router = Router();


// CRUD de produtos
router.get("/", produtoController.list);
router.get("/:id", produtoController.getById);
router.post("/", produtoController.create);
router.put("/:id", produtoController.update);
router.delete("/:id", produtoController.delete);

module.exports = router;
