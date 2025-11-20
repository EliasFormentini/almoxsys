// src/controllers/authController.js
const { Usuario } = require("../models");
const bcrypt = require("bcryptjs");

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios." });
      }

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const fakeToken = "fake-token-" + usuario.id;

      return res.json({
        token: fakeToken,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,          // <-- importante
          permissoes: usuario.permissoes,  // <-- importante (JSON/string/array)
        },
      });
    } catch (err) {
      console.error("Erro no login:", err);
      return res
        .status(500)
        .json({ error: "Erro ao realizar login.", details: err.message });
    }
  },
};

module.exports = authController;
