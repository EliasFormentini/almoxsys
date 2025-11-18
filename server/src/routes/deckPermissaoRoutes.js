// src/routes/deckPermissaoRoutes.js
const express = require("express");
const deckPermissaoController = require("../controllers/deckPermissaoController");

const router = express.Router();

router.get("/", deckPermissaoController.list);
router.post("/", deckPermissaoController.create);
router.put("/:id", deckPermissaoController.update);
router.delete("/:id", deckPermissaoController.remove);

module.exports = router;
