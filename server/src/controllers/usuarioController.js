// src/controllers/usuarioController.js
const { Usuario, DeckPermissao } = require("../models");
const bcrypt = require("bcryptjs");

const usuarioController = {
  // GET /api/usuarios
  async list(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nome", "email", "perfil"],
        include: [
          {
            model: DeckPermissao,
            as: "decks",
            attributes: ["id", "nome"],
            through: { attributes: [] },
          },
        ],
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
      const { nome, email, senha, perfil = "usuario" } = req.body;

      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({ error: "Nome, e-mail e senha são obrigatórios." });
      }

      const jaExiste = await Usuario.findOne({ where: { email } });
      if (jaExiste) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      const hash = await bcrypt.hash(senha, 10);

      const novo = await Usuario.create({
        nome,
        email,
        senha: hash,
        perfil,
      });

      return res.status(201).json({
        id: novo.id,
        nome: novo.nome,
        email: novo.email,
        perfil: novo.perfil,
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
      const { nome, email, senha, perfil } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      if (email && email !== usuario.email) {
        const existeEmail = await Usuario.findOne({ where: { email } });
        if (existeEmail) {
          return res.status(400).json({ error: "E-mail já cadastrado." });
        }
      }

      if (nome) usuario.nome = nome;
      if (email) usuario.email = email;
      if (perfil) usuario.perfil = perfil;

      if (senha) {
        const hash = await bcrypt.hash(senha, 10);
        usuario.senha = hash;
      }

      await usuario.save();

      return res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
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

      // impede que o admin delete ele mesmo (opcional)
      if (req.usuario && req.usuario.id === usuario.id) {
        return res
          .status(400)
          .json({ error: "Você não pode excluir o próprio usuário logado." });
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

  // GET /api/usuarios/:id/decks  -> lista decks do usuário
  async listDecks(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        attributes: ["id", "nome", "email"],
        include: [
          {
            model: DeckPermissao,
            as: "decks",
            attributes: ["id", "nome", "descricao"],
            through: { attributes: [] },
          },
        ],
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.json(usuario);
    } catch (err) {
      console.error("Erro ao listar decks do usuário:", err);
      return res.status(500).json({
        error: "Erro ao listar decks do usuário.",
        details: err.message,
      });
    }
  },

  // POST /api/usuarios/:id/decks  -> define/atualiza decks do usuário
  // body: { deckIds: [1,2,3] }
  async setDecks(req, res) {
    try {
      const { id } = req.params;
      const { deckIds = [] } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const decks = await DeckPermissao.findAll({
        where: { id: deckIds },
      });

      await usuario.setDecks(decks);

      const usuarioAtualizado = await Usuario.findByPk(id, {
        attributes: ["id", "nome", "email"],
        include: [
          {
            model: DeckPermissao,
            as: "decks",
            attributes: ["id", "nome", "descricao"],
            through: { attributes: [] },
          },
        ],
      });

      return res.json(usuarioAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar decks do usuário:", err);
      return res.status(500).json({
        error: "Erro ao atualizar decks do usuário.",
        details: err.message,
      });
    }
  },
};

module.exports = usuarioController;
