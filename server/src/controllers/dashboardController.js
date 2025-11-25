const { Op } = require("sequelize");
const { Produto, Movimentacao, Pedido } = require("../models");

function getLast12MonthsLabels() {
  const labels = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    labels.push(`${mes}/${ano}`);
  }
  return labels;
}

function formatMonthKey(date) {
  const d = new Date(date);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${mes}/${ano}`;
}

const dashboardController = {
  async resumo(req, res) {
    try {
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      const inicio12Meses = new Date(agora.getFullYear(), agora.getMonth() - 11, 1);

      // Cards principais
      const [
        totalProdutosAtivos,
        estoqueTotalItens,
        produtosAbaixoMinimo,
        entradasMes,
        saidasMes,
        pedidosPendentes,
        pedidosAprovados,
        pedidosAtendidos,
      ] = await Promise.all([
        Produto.count({ where: { status: "A" } }),
        Produto.sum("estoque_atual"),
        Produto.count({
          where: {
            estoque_atual: { [Op.lt]: require("sequelize").col("estoque_minimo") },
          },
        }),
        Movimentacao.sum("valor_total", {
          where: {
            tipo: "entrada",
            data_movimentacao: { [Op.gte]: inicioMes },
          },
        }),
        Movimentacao.sum("valor_total", {
          where: {
            tipo: "saida",
            data_movimentacao: { [Op.gte]: inicioMes },
          },
        }),
        Pedido.count({ where: { status: "pendente" } }),
        Pedido.count({ where: { status: "aprovado" } }),
        Pedido.count({ where: { status: "atendido" } }),
      ]);

      // Valor total estimado em estoque (estoque_atual * custo_medio)
      const produtos = await Produto.findAll({
        attributes: ["estoque_atual", "custo_medio"],
      });
      const valorTotalEstoque = produtos.reduce((acc, p) => {
        const qtd = Number(p.estoque_atual || 0);
        const custo = Number(p.custo_medio || 0);
        return acc + qtd * custo;
      }, 0);

      // Top 5 produtos mais saídos
      const topSaidas = await Movimentacao.findAll({
        where: {
          tipo: "saida",
        },
        attributes: [
          "id_produto",
          [require("sequelize").fn("SUM", require("sequelize").col("quantidade")), "totalQuantidade"],
        ],
        include: [
          {
            model: Produto,
            as: "produto",
            attributes: ["nome"],
          },
        ],
        group: ["Movimentacao.id_produto", "produto.id"],
        order: [[require("sequelize").literal("totalQuantidade"), "DESC"]],
        limit: 5,
      });

      const topProdutosSaida = topSaidas.map((item) => ({
        id_produto: item.id_produto,
        nome: item.produto?.nome || `ID ${item.id_produto}`,
        quantidade: Number(item.get("totalQuantidade") || 0),
      }));

      // Entradas x Saídas últimos 12 meses
      const movs12Meses = await Movimentacao.findAll({
        where: {
          data_movimentacao: { [Op.gte]: inicio12Meses },
        },
        attributes: ["tipo", "valor_total", "data_movimentacao"],
      });

      const labels = getLast12MonthsLabels();
      const mapEntradas = {};
      const mapSaidas = {};

      labels.forEach((lb) => {
        mapEntradas[lb] = 0;
        mapSaidas[lb] = 0;
      });

      movs12Meses.forEach((m) => {
        const key = formatMonthKey(m.data_movimentacao);
        const valor = Number(m.valor_total || 0);
        if (!labels.includes(key)) return;

        if (m.tipo === "entrada") {
          mapEntradas[key] += valor;
        } else if (m.tipo === "saida") {
          mapSaidas[key] += valor;
        }
      });

      const serieEntradas = labels.map((lb) => mapEntradas[lb] || 0);
      const serieSaidas = labels.map((lb) => mapSaidas[lb] || 0);

      return res.json({
        cards: {
          totalProdutosAtivos: totalProdutosAtivos || 0,
          estoqueTotalItens: estoqueTotalItens || 0,
          produtosAbaixoMinimo: produtosAbaixoMinimo || 0,
          valorTotalEstoque,
          entradasMes: entradasMes || 0,
          saidasMes: saidasMes || 0,
          pedidosPendentes,
          pedidosAprovados,
          pedidosAtendidos,
        },
        chartEntradasSaidas: {
          labels,
          entradas: serieEntradas,
          saidas: serieSaidas,
        },
        topProdutosSaida,
      });
    } catch (err) {
      console.error("Erro no dashboard:", err);
      return res
        .status(500)
        .json({ error: "Erro ao carregar dados do dashboard", details: err.message });
    }
  },
};

module.exports = dashboardController;
