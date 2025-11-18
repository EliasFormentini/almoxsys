// src/routes/usuarioRoutes.js
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// todas as rotas de usuário exigem estar logado E ser admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", usuarioController.list);
router.post("/", usuarioController.create);
router.put("/:id", usuarioController.update);
router.delete("/:id", usuarioController.remove);

module.exports = router;
