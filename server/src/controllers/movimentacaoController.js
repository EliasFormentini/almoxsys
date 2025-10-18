const { Movimentacao, Produto, Usuario, Pedido, Fornecedor } = require("../models");

const movimentacaoController = {
  // 🔹 Listar todas movimentações (com filtros opcionais)
  async list(req, res) {
    try {
      const { tipo, id_produto, id_usuario } = req.query;
      const where = {};
      if (tipo) where.tipo = tipo;
      if (id_produto) where.id_produto = id_produto;
      if (id_usuario) where.id_usuario = id_usuario;

      const movimentacoes = await Movimentacao.findAll({
        where,
        include: [
          { model: Produto, attributes: ["id", "nome"] },
          { model: Usuario, attributes: ["id", "nome"] },
          { model: Pedido, attributes: ["id", "tipo", "status"] },
          { model: Fornecedor, attributes: ["id", "nome"] },
        ],
        order: [["data_movimentacao", "DESC"]],
      });

      res.json(movimentacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar movimentações" });
    }
  },

  // 🔹 Registrar movimentação individual (entrada ou saída)
  async create(req, res) {
    try {
      const { tipo, id_produto, quantidade, id_pedido } = req.body;
      const id_usuario = req.user?.id || 1;

      const produto = await Produto.findByPk(id_produto);
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

      if (tipo === "entrada") produto.estoque_atual += quantidade;
      else if (tipo === "saida") {
        if (produto.estoque_atual < quantidade)
          return res.status(400).json({ error: "Estoque insuficiente" });
        produto.estoque_atual -= quantidade;
      } else {
        return res.status(400).json({ error: "Tipo inválido, use 'entrada' ou 'saida'" });
      }

      await produto.save();

      const movimentacao = await Movimentacao.create({
        tipo,
        id_produto,
        quantidade,
        id_usuario,
        id_pedido: id_pedido || null,
      });

      res.status(201).json(movimentacao);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao registrar movimentação" });
    }
  },

  // 🔹 Criar múltiplos produtos em uma única entrada
  async createEntrada(req, res) {
    try {
      const { numero_nota, serie_nota, id_fornecedor, observacao, produtos } = req.body;
      const id_usuario = req.user?.id || 1;

      if (!produtos || produtos.length === 0)
        return res.status(400).json({ error: "Nenhum produto informado" });

      const movimentacoesCriadas = [];

      for (const item of produtos) {
        const { id_produto, quantidade, valor_unitario } = item;
        const valor_total = quantidade * valor_unitario;

        const novaMov = await Movimentacao.create({
          tipo: "entrada",
          id_produto,
          quantidade,
          valor_unitario,
          valor_total,
          numero_nota,
          serie_nota,
          id_fornecedor,
          observacao,
          id_usuario,
          data_movimentacao: new Date(),
        });

        // Atualiza estoque
        const produto = await Produto.findByPk(id_produto);
        if (produto) {
          produto.estoque_atual += quantidade;
          await produto.save();
        }

        movimentacoesCriadas.push(novaMov);
      }

      res.status(201).json({
        message: "Entrada registrada com sucesso",
        movimentacoes: movimentacoesCriadas,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao registrar entrada", details: err.message });
    }
  },

  // 🔹 Buscar movimentação por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const mov = await Movimentacao.findByPk(id, {
        include: [
          { model: Produto, attributes: ["id", "nome"] },
          { model: Usuario, attributes: ["id", "nome"] },
          { model: Pedido, attributes: ["id", "tipo", "status"] },
          { model: Fornecedor, attributes: ["id", "nome"] },
        ],
      });

      if (!mov) return res.status(404).json({ error: "Movimentação não encontrada" });
      res.json(mov);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar movimentação" });
    }
  },
};

module.exports = movimentacaoController;
