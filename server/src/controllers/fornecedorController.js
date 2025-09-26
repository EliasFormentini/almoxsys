const { Fornecedor } = require("../models");

module.exports = {
  async listar(req, res) {
    try {
      const fornecedores = await Fornecedor.findAll();
      res.json(fornecedores);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar fornecedores", details: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const fornecedor = await Fornecedor.findByPk(id);
      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar fornecedor", details: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { nome, cnpj, telefone, email } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "O campo nome é obrigatório" });
      }

      const novoFornecedor = await Fornecedor.create({
        nome,
        cnpj,
        telefone,
        email
      });

      res.status(201).json(novoFornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar fornecedor", details: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cnpj, telefone, email } = req.body;

      const fornecedor = await Fornecedor.findByPk(id);
      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      fornecedor.nome = nome || fornecedor.nome;
      fornecedor.cnpj = cnpj || fornecedor.cnpj;
      fornecedor.telefone = telefone || fornecedor.telefone;
      fornecedor.email = email || fornecedor.email;

      await fornecedor.save();

      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar fornecedor", details: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const fornecedor = await Fornecedor.findByPk(id);

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      await fornecedor.destroy();
      res.json({ message: "Fornecedor removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar fornecedor", details: error.message });
    }
  }
};
