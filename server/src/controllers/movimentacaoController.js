const { Movimentacao, Produto, Fornecedor, Usuario } = require("../models");
const { Sequelize } = require("sequelize");

const movimentacaoController = {
  // LISTAR (entradas agrupadas / saídas individuais)
  async list(req, res) {
    try {
      const { tipo } = req.query;
      const where = {};
      if (tipo) where.tipo = tipo;

      const movimentacoes = await Movimentacao.findAll({
        where,
        include: [
          { model: Produto, as: "produto", attributes: ["id", "nome", "custo_medio"] },
          { model: Fornecedor, as: "fornecedor", attributes: ["id", "nome"] },
          { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
        ],
        order: [["data_movimentacao", "DESC"]],
      });

      // Entradas agrupadas
      if (tipo === "entrada") {
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

          // Saídas agrupadas (por data + observação)
      if (tipo === "saida") {
        const agrupadas = Object.values(
          movimentacoes.reduce((acc, mov) => {
            const dataKey = mov.data_movimentacao
              ? new Date(mov.data_movimentacao).toISOString().slice(0, 10)
              : "";
            const chave = `${dataKey}-${mov.observacao || ""}`;

            if (!acc[chave]) {
              acc[chave] = {
                id: mov.id, // apenas para key no front
                data_movimentacao: mov.data_movimentacao,
                observacao: mov.observacao,
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

        return res.json(agrupadas);
      }

        return res.json(agrupadas);
      }

      // Saídas → sem agrupamento
      return res.json(movimentacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar movimentações", details: err.message });
    }
  },

  // CRIAR MOVIMENTAÇÃO (entrada ou saída)
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
        observacao,
      } = req.body;

      const produto = await Produto.findByPk(id_produto);
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      let valorUnitario = valor_unitario;
      let valorTotal = 0;

      if (tipo === "entrada") {
        // === ENTRADA ===
        const qtd = Number(quantidade);
        const vu = Number(valor_unitario);

        const estoqueAnterior = Number(produto.estoque_atual || 0);
        const custoAnterior = Number(produto.custo_medio || 0);

        // custo médio ponderado
        const novoEstoque = estoqueAnterior + qtd;
        const novoCustoMedio =
          novoEstoque > 0
            ? ((custoAnterior * estoqueAnterior) + (vu * qtd)) / novoEstoque
            : 0;

        produto.estoque_atual = novoEstoque;
        produto.custo_medio = novoCustoMedio;
        await produto.save();

        valorUnitario = vu;
        valorTotal = qtd * vu;
      } else if (tipo === "saida") {
        // === SAÍDA ===
        const qtd = Number(quantidade);
        const custoMedio = Number(produto.custo_medio || 0);

        if (produto.estoque_atual < qtd) {
          return res.status(400).json({ error: "Estoque insuficiente" });
        }

        produto.estoque_atual -= qtd;
        await produto.save();

        valorUnitario = custoMedio;
        valorTotal = qtd * custoMedio;
      }

      const novaMov = await Movimentacao.create({
        tipo,
        id_produto,
        quantidade,
        valor_unitario: valorUnitario,
        valor_total: valorTotal,
        numero_nota: tipo === "entrada" ? numero_nota : null,
        serie_nota: tipo === "entrada" ? serie_nota : null,
        id_fornecedor: tipo === "entrada" ? id_fornecedor : null,
        id_usuario,
        observacao: observacao || null,
        data_movimentacao: req.body.data_movimentacao
          ? new Date(req.body.data_movimentacao)
          : new Date(),
      });

      res.status(201).json(novaMov);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar movimentação", details: err.message });
    }
  },

  // CRIAR ENTRADA (com vários produtos)
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

        const qtd = Number(quantidade);
        const vu = Number(valor_unitario);

        const estoqueAnterior = Number(produto.estoque_atual || 0);
        const custoAnterior = Number(produto.custo_medio || 0);

        const novoEstoque = estoqueAnterior + qtd;
        const novoCustoMedio =
          novoEstoque > 0
            ? ((custoAnterior * estoqueAnterior) + (vu * qtd)) / novoEstoque
            : 0;

        produto.estoque_atual = novoEstoque;
        produto.custo_medio = novoCustoMedio;
        await produto.save();

        const valor_total = qtd * vu;

        const mov = await Movimentacao.create({
          tipo: "entrada",
          id_produto,
          quantidade: qtd,
          valor_unitario: vu,
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
          { model: Produto, as: "produto", attributes: ["id", "nome", "custo_medio"] },
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
