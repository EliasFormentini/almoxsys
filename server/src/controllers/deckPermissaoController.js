// src/controllers/deckPermissaoController.js
const { DeckPermissao } = require("../models");

const deckPermissaoController = {
  // GET /api/decks-permissao
  async list(req, res) {
    try {
      const decks = await DeckPermissao.findAll({
        order: [["id", "ASC"]],
      });
      return res.json(decks);
    } catch (err) {
      console.error("Erro ao listar decks de permissão:", err);
      return res
        .status(500)
        .json({ error: "Erro ao listar decks de permissão." });
    }
  },

  // POST /api/decks-permissao
  async create(req, res) {
    try {
      const { nome, descricao, permissoes } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "Nome do deck é obrigatório." });
      }

      const novo = await DeckPermissao.create({
        nome,
        descricao: descricao || null,
        permissoes: permissoes || null, // se for JSON/texto
      });

      return res.status(201).json(novo);
    } catch (err) {
      console.error("Erro ao criar deck de permissão:", err);
      return res
        .status(500)
        .json({ error: "Erro ao criar deck de permissão." });
    }
  },

  // PUT /api/decks-permissao/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, permissoes } = req.body;

      const deck = await DeckPermissao.findByPk(id);
      if (!deck) {
        return res.status(404).json({ error: "Deck de permissão não encontrado." });
      }

      deck.nome = nome ?? deck.nome;
      deck.descricao = descricao ?? deck.descricao;
      deck.permissoes = permissoes ?? deck.permissoes;

      await deck.save();

      return res.json(deck);
    } catch (err) {
      console.error("Erro ao atualizar deck de permissão:", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar deck de permissão." });
    }
  },

  // DELETE /api/decks-permissao/:id
  async remove(req, res) {
    try {
      const { id } = req.params;

      const deck = await DeckPermissao.findByPk(id);
      if (!deck) {
        return res.status(404).json({ error: "Deck de permissão não encontrado." });
      }

      await deck.destroy();
      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao excluir deck de permissão:", err);
      return res
        .status(500)
        .json({ error: "Erro ao excluir deck de permissão." });
    }
  },
};

module.exports = deckPermissaoController;
