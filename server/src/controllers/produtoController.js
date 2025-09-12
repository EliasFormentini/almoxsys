const { Produto, Categoria, Unidade } = require("../models");

const produtoController = {
  // Listar todos os produtos
  async list(req, res) {
    try {
      const produtos = await Produto.findAll({
        include: [
          { model: Categoria, attributes: ["id", "nome"] },
          { model: Unidade, attributes: ["id", "sigla", "descricao"] },
        ],
      });
      res.json(produtos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar produtos" });
    }
  },

  // Buscar produto por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id, {
        include: [
          { model: Categoria, attributes: ["id", "nome"] },
          { model: Unidade, attributes: ["id", "sigla", "descricao"] },
        ],
      });
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
      res.json(produto);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  },

  // Criar novo produto
  async create(req, res) {
    try {
      const { nome, id_categoria, id_unidade, estoque_atual, estoque_minimo } = req.body;
      const produto = await Produto.create({
        nome,
        id_categoria,
        id_unidade,
        estoque_atual: estoque_atual || 0,
        estoque_minimo: estoque_minimo || 0,
      });
      res.status(201).json(produto);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  },

  // Atualizar produto
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, id_categoria, id_unidade, estoque_atual, estoque_minimo } = req.body;

      const produto = await Produto.findByPk(id);
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

      await produto.update({ nome, id_categoria, id_unidade, estoque_atual, estoque_minimo });
      res.json(produto);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  },

  // Deletar produto
  async delete(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

      await produto.destroy();
      res.json({ message: "Produto deletado com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  },
};

module.exports = produtoController;
