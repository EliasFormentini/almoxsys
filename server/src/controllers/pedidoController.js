const { Pedido, ItemPedido, Produto, Movimentacao, Usuario } = require("../models");

const pedidoController = {
  async list(req, res) {
    try {
      const { tipo } = req.query;
      const where = tipo ? { tipo } : {};

      const pedidos = await Pedido.findAll({
        where,
        order: [["id", "DESC"]],
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email", "perfil"],
          },
          {
            model: ItemPedido,
            as: "itens",
            include: [
              {
                model: Produto,
                as: "produto",
              },
            ],
          },
        ],
      });

      res.json(pedidos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar pedidos" });
    }
  },


  async create(req, res) {
    try {
      const { tipo, items } = req.body; 

      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const id_usuario = req.user.id;
      if (!tipo) {
        return res.status(400).json({ error: "Tipo do pedido é obrigatório." });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ error: "É necessário informar ao menos um item no pedido." });
      }

      const itensPreparados = items.map((item) => {
        const quantidade = Number(item.quantidade || 0);
        const valor_unitario = Number(
          (item.valor_unitario ?? 0).toString().replace(",", ".")
        );
        const valor_total = quantidade * valor_unitario;

        return {
          id_produto: item.id_produto,
          quantidade,
          valor_unitario,
          valor_total,
        };
      });

      const valor_total_pedido = itensPreparados.reduce(
        (acc, item) => acc + item.valor_total,
        0
      );

      const pedido = await Pedido.create({
        tipo,
        id_usuario,
        valor_total: valor_total_pedido,
      });

      for (const item of itensPreparados) {
        await ItemPedido.create({
          id_pedido: pedido.id,
          id_produto: item.id_produto,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
        });
      }

      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email", "perfil"],
          },
          {
            model: ItemPedido,
            as: "itens",
            include: [
              {
                model: Produto,
                as: "produto",
              },
            ],
          },
        ],
      });

      return res.status(201).json(pedidoCompleto);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar pedido" });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório." });
      }

      const pedido = await Pedido.findByPk(id, {
        include: [
          {
            model: ItemPedido,
            as: "itens",
          },
        ],
      });

      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      pedido.status = status;
      await pedido.save();

      if (status === "aprovado" && pedido.tipo === "retirada") {
        for (const item of pedido.itens) {
          await Movimentacao.create({
            tipo: "saida",
            id_produto: item.id_produto,
            id_usuario: req.user.id,
            id_pedido: pedido.id,
            quantidade: item.quantidade,
          });

          const produto = await Produto.findByPk(item.id_produto);
          if (produto) {
            produto.estoque_atual -= item.quantidade;
            await produto.save();
          }
        }
      }

      res.json({ message: `Pedido ${status} com sucesso!` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar status do pedido" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Pedido.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email", "perfil"],
          },
          {
            model: ItemPedido,
            as: "itens",
            include: [
              {
                model: Produto,
                as: "produto",
              },
            ],
          },
        ],
      });

      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      res.json(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar pedido" });
    }
  },
};

module.exports = pedidoController;
