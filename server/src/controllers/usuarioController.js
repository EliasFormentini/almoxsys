const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const usuarioController = {
  // Registro de novo usuário
  async register(req, res) {
    try {
      const { nome, email, senha, perfil } = req.body;

      // verifica se email já existe
      const userExists = await Usuario.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const user = await Usuario.create({
        nome,
        email,
        senha: hashedPassword,
        perfil,
      });

      res.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  },

  // Login de usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha inválida" });
      }

      const token = jwt.sign(
        { id: user.id, perfil: user.perfil },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({ message: "Login realizado com sucesso!", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro no login" });
    }
  },

  // Obter perfil do usuário autenticado
  async profile(req, res) {
    try {
      const user = await Usuario.findByPk(req.user.id, {
        attributes: ["id", "nome", "email", "perfil"],
      });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar perfil" });
    }
  },
};

module.exports = usuarioController;
