const { Router } = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

// Registro e login
router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);

// Perfil (rota protegida)
router.get("/profile", authMiddleware, usuarioController.profile);

module.exports = router;
