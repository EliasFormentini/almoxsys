const { Router } = require("express");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

// Rotas de autenticação e perfil de usuário
router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);
router.get("/profile", usuarioController.profile);

module.exports = router;
