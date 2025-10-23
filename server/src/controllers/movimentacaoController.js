const { Movimentacao, Produto, Fornecedor, Usuario } = require("../models");
const { Sequelize } = require("sequelize");

const movimentacaoController = {
  //  LISTAR ENTRADAS AGRUPADAS (nota + série + fornecedor)
  async list(req, res) {
    try {
      const { tipo } = req.query;
      const where = {};
      if (tipo) where.tipo = tipo;

      // Busca todas as movimentações com joins e aliases corretos
      const movimentacoes = await Movimentacao.findAll({
        where,
        include: [
          { model: Produto, as: "produto", attributes: ["id", "nome"] },
          { model: Fornecedor, as: "fornecedor", attributes: ["id", "nome"] },
          { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
        ],
        order: [["data_movimentacao", "DESC"]],
      });

      // Agrupando movimentações pela nota + série + fornecedor
      const agrupadas = Object.values(
        movimentacoes.reduce((acc, mov) => {
          const chave = `${mov.numero_nota}-${mov.serie_nota}-${mov.id_fornecedor || 0}`;
          if (!acc[chave]) {
            acc[chave] = {
              id: mov.id,
              numero_nota: mov.numero_nota,
              serie_nota: mov.serie_nota,
              data_movimentacao: mov.data_movimentacao,
              fornecedor: mov.fornecedor,
              itens: [],
            };
          }
          acc[chave].itens.push({
            id: mov.id,
            produto: mov.produto,
            quantidade: mov.quantidade,
            valor_unitario: mov.valor_unitario,
            valor_total: mov.valor_total,
          });
          return acc;
        }, {})
      );

      res.json(agrupadas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar movimentações", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const {
        tipo,
        id_produto,
        quantidade,
        valor_unitario,
        numero_nota,
        serie_nota,
        id_fornecedor,
        id_usuario,
      } = req.body;

      const produto = await Produto.findByPk(id_produto);
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const valor_total = quantidade * valor_unitario;

      // Atualiza estoque se for entrada
      if (tipo === "entrada") {
        produto.estoque_atual += quantidade;
      } else if (tipo === "saida") {
        if (produto.estoque_atual < quantidade) {
          return res.status(400).json({ error: "Estoque insuficiente" });
        }
        produto.estoque_atual -= quantidade;
      }
      await produto.save();

      // Cria a movimentação
      const novaMov = await Movimentacao.create({
        tipo,
        id_produto,
        quantidade,
        valor_unitario,
        valor_total,
        numero_nota,
        serie_nota,
        id_fornecedor,
        id_usuario,
        data_movimentacao: new Date(),
      });

      res.status(201).json(novaMov);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar movimentação", details: err.message });
    }
  },

  async createEntrada(req, res) {
    try {
      const { numero_nota, serie_nota, id_fornecedor, observacao, produtos = [] } = req.body;

      if (!numero_nota || produtos.length === 0) {
        return res.status(400).json({ error: "Número da nota e produtos são obrigatórios." });
      }

      const novasMovimentacoes = [];

      for (const item of produtos) {
        const { id_produto, quantidade, valor_unitario } = item;
        const produto = await Produto.findByPk(id_produto);
        if (!produto) continue;

        const valor_total = quantidade * valor_unitario;

        // Atualiza estoque
        produto.estoque_atual += quantidade;
        await produto.save();

        const mov = await Movimentacao.create({
          tipo: "entrada",
          id_produto,
          quantidade,
          valor_unitario,
          valor_total,
          numero_nota,
          serie_nota,
          id_fornecedor,
          observacao,
          data_movimentacao: new Date(),
        });

        novasMovimentacoes.push(mov);
      }

      res.status(201).json({
        message: "Entrada registrada com sucesso",
        movimentacoes: novasMovimentacoes,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar entrada", details: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const mov = await Movimentacao.findByPk(id, {
        include: [
          { model: Produto, as: "produto", attributes: ["id", "nome"] },
          { model: Fornecedor, as: "fornecedor", attributes: ["id", "nome"] },
          { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
        ],
      });

      if (!mov) return res.status(404).json({ error: "Movimentação não encontrada" });
      res.json(mov);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar movimentação", details: err.message });
    }
  },
};

module.exports = movimentacaoController;
