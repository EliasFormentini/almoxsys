const { Inventario, InventarioProduto, Produto } = require("../models");

const inventarioController = {
    // Lista inventários (cabeçalhos)
    async list(req, res) {
        try {
            const { aberto } = req.query;
            const where = {};

            if (aberto === "true") where.inventario_concluido = false;
            if (aberto === "false") where.inventario_concluido = true;

            const inventarios = await Inventario.findAll({
                where,
                order: [["data_abertura", "DESC"], ["id", "DESC"]],
            });

            return res.json(inventarios);
        } catch (err) {
            console.error("Erro ao listar inventários:", err);
            return res
                .status(500)
                .json({ error: "Erro ao listar inventários", details: err.message });
        }
    },

    async create(req, res) {
        try {
            const { data_abertura } = req.body;

            const existente = await Inventario.findOne({
                where: { inventario_concluido: false },
            });

            if (existente) {
                return res.status(400).json({
                    error: "Já existe um inventário em aberto.",
                    inventario_id: existente.id,
                });
            }

            const novo = await Inventario.create({
                data_abertura: data_abertura || new Date(),
                inventario_concluido: false,
            });

            return res.status(201).json(novo);
        } catch (err) {
            console.error("Erro ao abrir inventário:", err);
            return res.status(500).json({
                error: "Erro ao abrir inventário",
                details: err.message,
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;

            const inventario = await Inventario.findByPk(id, {
                include: [
                    {
                        model: InventarioProduto,
                        as: "itens",
                        include: [
                            {
                                model: Produto,
                                as: "produto",
                                attributes: ["id", "nome", "estoque_atual", "custo_medio"],
                            },
                        ],
                    },
                ],
            });

            if (!inventario) {
                return res.status(404).json({ error: "Inventário não encontrado." });
            }

            return res.json(inventario);
        } catch (err) {
            console.error("Erro ao buscar inventário:", err);
            return res.status(500).json({
                error: "Erro ao buscar inventário",
                details: err.message,
            });
        }
    },

    async concluir(req, res) {
        try {
            const { id } = req.params;
            const { itens } = req.body;

            const inventario = await Inventario.findByPk(id);

            if (!inventario) {
                return res.status(404).json({ error: "Inventário não encontrado." });
            }

            if (inventario.inventario_concluido) {
                return res
                    .status(400)
                    .json({ error: "Este inventário já está concluído." });
            }

            if (!Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({
                    error: "Envie ao menos um item com id_produto e qtd_correta.",
                });
            }

            // cria itens + ajusta estoque
            for (const item of itens) {
                const id_produto = Number(item.id_produto);
                const qtd = Number(item.qtd_correta);

                if (!id_produto || isNaN(qtd) || qtd < 0) {
                    return res.status(400).json({
                        error: "Dados inválidos em um dos itens.",
                    });
                }

                const produto = await Produto.findByPk(id_produto);
                if (!produto) {
                    return res.status(404).json({
                        error: `Produto não encontrado (ID ${id_produto}).`,
                    });
                }

                // registra a contagem
                await InventarioProduto.create({
                    id_inventario: inventario.id,
                    id_produto,
                    qtd_correta: qtd,
                });

                // ajusta estoque para o valor contado
                produto.estoque_atual = qtd;
                await produto.save();
            }

            inventario.inventario_concluido = true;
            await inventario.save();

            const inventarioFinal = await Inventario.findByPk(id, {
                include: [
                    {
                        model: InventarioProduto,
                        as: "itens",
                        include: [{ model: Produto, as: "produto" }],
                    },
                ],
            });

            return res.json({
                message: "Inventário concluído com sucesso.",
                inventario: inventarioFinal,
            });
        } catch (err) {
            console.error("Erro ao concluir inventário:", err);
            return res.status(500).json({
                error: "Erro ao concluir inventário",
                details: err.message,
            });
        }
    },
};

module.exports = inventarioController;
