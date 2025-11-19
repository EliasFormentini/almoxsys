// src/controllers/usuarioController.js
const { Usuario } = require("../models");
const bcrypt = require("bcryptjs");

const usuarioController = {
  // GET /api/usuarios
  async list(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nome", "email", "perfil", "permissoes"],
        order: [["id", "ASC"]],
      });

      return res.json(usuarios);
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      return res
        .status(500)
        .json({ error: "Erro ao listar usuários.", details: err.message });
    }
  },

  // POST /api/usuarios
  async create(req, res) {
    try {
      const { nome, email, senha, perfil } = req.body;

      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({ error: "Nome, e-mail e senha são obrigatórios." });
      }

      const usuarioExistente = await Usuario.findOne({ where: { email } });

      if (usuarioExistente) {
        return res
          .status(400)
          .json({ error: "Já existe um usuário cadastrado com este e-mail." });
      }

      // perfil padrão "user" se nada for enviado
      const perfilFinal = perfil || "user";

      const senhaHash = await bcrypt.hash(senha, 10);

      const novo = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        perfil: perfilFinal,
        permissoes: [], // inicia sem decks
      });

      return res.status(201).json({
        id: novo.id,
        nome: novo.nome,
        email: novo.email,
        perfil: novo.perfil,
        permissoes: novo.permissoes || [],
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res
        .status(500)
        .json({ error: "Erro ao criar usuário.", details: err.message });
    }
  },

  // PUT /api/usuarios/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, perfil, senha } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      if (email && email !== usuario.email) {
        const emailJaExiste = await Usuario.findOne({ where: { email } });
        if (emailJaExiste) {
          return res
            .status(400)
            .json({ error: "Já existe outro usuário com este e-mail." });
        }
      }

      if (nome) usuario.nome = nome;
      if (email) usuario.email = email;
      if (perfil) usuario.perfil = perfil;

      if (senha) {
        const senhaHash = await bcrypt.hash(senha, 10);
        usuario.senha = senhaHash;
      }

      await usuario.save();

      return res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        permissoes: usuario.permissoes || [],
      });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar usuário.", details: err.message });
    }
  },

  // DELETE /api/usuarios/:id
  async remove(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      await usuario.destroy();

      return res.json({ message: "Usuário excluído com sucesso." });
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      return res
        .status(500)
        .json({ error: "Erro ao excluir usuário.", details: err.message });
    }
  },

  // PUT /api/usuarios/:id/decks
  // body: { decks: ["produtos", "fornecedores", ...] }
  async definirDecks(req, res) {
    try {
      const { id } = req.params;
      const { decks } = req.body;

      if (!Array.isArray(decks)) {
        return res
          .status(400)
          .json({ error: "Formato inválido de decks. Esperado array de strings." });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      usuario.permissoes = decks;
      await usuario.save();

      return res.json({
        message: "Permissões atualizadas com sucesso.",
        permissoes: usuario.permissoes || [],
      });
    } catch (err) {
      console.error("Erro ao definir decks do usuário:", err);
      return res.status(500).json({
        error: "Erro ao definir permissões do usuário.",
        details: err.message,
      });
    }
  },
};

module.exports = usuarioController;
