const { Categoria } = require("../models");

module.exports = {
  async listar(req, res) {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar categorias", details: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar categoria", details: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ error: "O campo nome é obrigatório" });
      }
      const novaCategoria = await Categoria.create({ nome });
      res.status(201).json(novaCategoria);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar categoria", details: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      categoria.nome = nome || categoria.nome;
      await categoria.save();

      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar categoria", details: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      await categoria.destroy();
      res.json({ message: "Categoria removida com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar categoria", details: error.message });
    }
  }
};
