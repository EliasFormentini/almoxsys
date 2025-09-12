const { Pedido, ItemPedido, Produto, Movimentacao, Usuario } = require("../models");

const pedidoController = {
  // Listar todos os pedidos (filtrável por tipo)
  async list(req, res) {
    try {
      const { tipo } = req.query;
      const where = tipo ? { tipo } : {};
      const pedidos = await Pedido.findAll({
        where,
        include: [
          { model: Usuario, attributes: ["id", "nome", "email", "perfil"] },
          {
            model: ItemPedido,
            include: [Produto],
          },
        ],
      });
      res.json(pedidos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar pedidos" });
    }
  },

  // Criar pedido
  async create(req, res) {
    try {
      const { tipo, items } = req.body;
      const id_usuario = req.user.id;

      const pedido = await Pedido.create({ tipo, id_usuario });

      // Criar itens do pedido
      for (const item of items) {
        await ItemPedido.create({
          id_pedido: pedido.id,
          id_produto: item.id_produto,
          quantidade: item.quantidade,
        });
      }

      res.status(201).json({ message: "Pedido criado com sucesso", pedido_id: pedido.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar pedido" });
    }
  },

  // Aprovar/Rejeitar pedido
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // "aprovado" ou "rejeitado"

      const pedido = await Pedido.findByPk(id, { include: [ItemPedido] });
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

      pedido.status = status;
      await pedido.save();

      // Se for aprovação e tipo "retirada", gerar movimentação de saída
      if (status === "aprovado" && pedido.tipo === "retirada") {
        for (const item of pedido.ItemPedidos) {
          await Movimentacao.create({
            tipo: "saida",
            id_produto: item.id_produto,
            id_usuario: req.user.id,
            id_pedido: pedido.id,
            quantidade: item.quantidade,
          });

          // Atualizar estoque
          const produto = await Produto.findByPk(item.id_produto);
          produto.estoque_atual -= item.quantidade;
          await produto.save();
        }
      }

      res.json({ message: `Pedido ${status} com sucesso!` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar status do pedido" });
    }
  },

  // Obter pedido por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findByPk(id, {
        include: [
          { model: Usuario, attributes: ["id", "nome"] },
          { model: ItemPedido, include: [Produto] },
        ],
      });
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
      res.json(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar pedido" });
    }
  },
};

module.exports = pedidoController;
