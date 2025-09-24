const { Unidade } = require("../models");

module.exports = {
  async listar(req, res) {
    try {
      const unidades = await Unidade.findAll();
      res.json(unidades);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar unidades", details: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const unidade = await Unidade.findByPk(id);
      if (!unidade) {
        return res.status(404).json({ error: "Unidade não encontrada" });
      }
      res.json(unidade);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar unidade", details: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { nome, sigla } = req.body;
      if (!nome || !sigla) {
        return res.status(400).json({ error: "Os campos nome e sigla são obrigatórios" });
      }
      const novaUnidade = await Unidade.create({ nome, sigla });
      res.status(201).json(novaUnidade);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar unidade", details: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, sigla } = req.body;

      const unidade = await Unidade.findByPk(id);
      if (!unidade) {
        return res.status(404).json({ error: "Unidade não encontrada" });
      }

      unidade.nome = nome || unidade.nome;
      unidade.sigla = sigla || unidade.sigla;
      await unidade.save();

      res.json(unidade);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar unidade", details: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const unidade = await Unidade.findByPk(id);

      if (!unidade) {
        return res.status(404).json({ error: "Unidade não encontrada" });
      }

      await unidade.destroy();
      res.json({ message: "Unidade removida com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar unidade", details: error.message });
    }
  }
};
