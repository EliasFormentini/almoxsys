const PDFDocument = require("pdfkit");
const { Op } = require("sequelize");
const { Produto, Categoria, Unidade, Movimentacao, Fornecedor, Usuario } = require("../models");

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("pt-BR");
};

// ====================
// RELATÓRIO: ESTOQUE ATUAL
// ====================
async function estoqueAtual(req, res) {
  try {
    const produtos = await Produto.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        { model: Unidade, as: "unidade" },
      ],
      order: [["nome", "ASC"]],
    });

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="relatorio-estoque-atual.pdf"'
    );

    doc.pipe(res);

    // Cabeçalho
    doc
      .fontSize(18)
      .text("Relatório de Estoque Atual", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
        align: "center",
      });

    doc.moveDown(1);

    // Cabeçalho da tabela
    const tableTop = 130;

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Cód", 40, tableTop);
    doc.text("Produto", 80, tableTop);
    doc.text("Categoria", 230, tableTop);
    doc.text("Un.", 380, tableTop);
    doc.text("Estoque", 420, tableTop, { width: 60, align: "right" });
    doc.text("Mínimo", 480, tableTop, { width: 60, align: "right" });

    doc
      .moveTo(40, tableTop + 15)
      .lineTo(540, tableTop + 15)
      .stroke();

    // Linhas
    let y = tableTop + 25;
    doc.font("Helvetica").fontSize(9);

    const linhaHeight = 18;
    const pageBottom = 780;

    produtos.forEach((p) => {
      if (y > pageBottom) {
        doc.addPage();
        y = 40;
      }

      const estoque = Number(p.estoque_atual || 0);
      const minimo = Number(p.estoque_minimo || 0);

      doc.text(p.id, 40, y);
      doc.text(p.nome || "", 80, y, { width: 140 });
      doc.text(p.categoria?.nome || "-", 230, y, { width: 140 });
      doc.text(p.unidade?.sigla || "-", 380, y);

      doc.text(estoque.toString(), 420, y, {
        width: 60,
        align: "right",
      });
      doc.text(minimo.toString(), 480, y, {
        width: 60,
        align: "right",
      });

      y += linhaHeight;
    });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar relatório de estoque:", err);
    return res
      .status(500)
      .json({ error: "Erro ao gerar relatório de estoque." });
  }
}

// ====================
// RELATÓRIO: ENTRADAS POR PERÍODO
// ====================
async function entradasPeriodo(req, res) {
  try {
    let { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res
        .status(400)
        .json({ error: "Informe dataInicio e dataFim (YYYY-MM-DD)." });
    }

    // garante formato Date
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);

    const entradas = await Movimentacao.findAll({
      where: {
        tipo: "entrada",
        data_movimentacao: {
          [Op.between]: [inicio, fim],
        },
      },
      include: [
        { model: Produto, as: "produto", include: [{ model: Unidade, as: "unidade" }] },
        { model: Fornecedor, as: "fornecedor" },
        { model: Usuario, as: "usuario" },
      ],
      order: [["data_movimentacao", "ASC"]],
    });

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="relatorio-entradas-periodo.pdf"'
    );

    doc.pipe(res);

    // Cabeçalho
    doc
      .fontSize(16)
      .text("Relatório de Entradas", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .text(
        `Período: ${formatDate(inicio)} até ${formatDate(fim)} · Gerado em: ${new Date().toLocaleString(
          "pt-BR"
        )}`,
        { align: "center" }
      );

    doc.moveDown(1);

    // Cabeçalho da tabela
    const tableTop = 130;
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Data", 40, tableTop);
    doc.text("Produto", 90, tableTop);
    doc.text("Qtd", 260, tableTop, { width: 40, align: "right" });
    doc.text("Un.", 305, tableTop);
    doc.text("Vlr Unit", 340, tableTop, { width: 70, align: "right" });
    doc.text("Total", 415, tableTop, { width: 70, align: "right" });
    doc.text("Fornecedor", 490, tableTop, { width: 100 });

    doc
      .moveTo(40, tableTop + 14)
      .lineTo(540, tableTop + 14)
      .stroke();

    let y = tableTop + 22;
    const linhaHeight = 16;
    const pageBottom = 780;

    doc.font("Helvetica").fontSize(9);

    let totalGeral = 0;

    entradas.forEach((m) => {
      if (y > pageBottom) {
        doc.addPage();
        y = 40;
      }

      const qtd = Number(m.quantidade || 0);
      const vlrUnit = Number(m.valor_unitario || 0);
      const total = qtd * vlrUnit;
      totalGeral += total;

      doc.text(formatDate(m.data_movimentacao), 40, y);
      doc.text(m.produto?.nome || "-", 90, y, { width: 160 });
      doc.text(qtd.toString(), 260, y, { width: 40, align: "right" });
      doc.text(m.produto?.unidade?.sigla || "-", 305, y);
      doc.text(vlrUnit.toFixed(2), 340, y, { width: 70, align: "right" });
      doc.text(total.toFixed(2), 415, y, { width: 70, align: "right" });
      doc.text(m.fornecedor?.nome || "-", 490, y, { width: 100 });

      y += linhaHeight;
    });

    // total geral
    doc.moveDown(1.5);
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`Total geral do período: R$ ${totalGeral.toFixed(2)}`, {
        align: "right",
      });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar relatório de entradas:", err);
    return res
      .status(500)
      .json({ error: "Erro ao gerar relatório de entradas." });
  }
}

// ====================
// RELATÓRIO: SAÍDAS POR PERÍODO
// ====================
async function saiasPeriodo(req, res) {
  try {
    let { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res
        .status(400)
        .json({ error: "Informe dataInicio e dataFim (YYYY-MM-DD)." });
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);

    const saidas = await Movimentacao.findAll({
      where: {
        tipo: "saida",
        data_movimentacao: {
          [Op.between]: [inicio, fim],
        },
      },
      include: [
        { model: Produto, as: "produto", include: [{ model: Unidade, as: "unidade" }] },
        { model: Usuario, as: "usuario" },
      ],
      order: [["data_movimentacao", "ASC"]],
    });

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="relatorio-saidas-periodo.pdf"'
    );

    doc.pipe(res);

    // Cabeçalho
    doc
      .fontSize(16)
      .text("Relatório de Saídas", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .text(
        `Período: ${formatDate(inicio)} até ${formatDate(fim)} · Gerado em: ${new Date().toLocaleString(
          "pt-BR"
        )}`,
        { align: "center" }
      );

    doc.moveDown(1);

    // Cabeçalho da tabela
    const tableTop = 130;
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Data", 40, tableTop);
    doc.text("Produto", 90, tableTop);
    doc.text("Qtd", 260, tableTop, { width: 40, align: "right" });
    doc.text("Un.", 305, tableTop);
    doc.text("Vlr Unit", 340, tableTop, { width: 70, align: "right" });
    doc.text("Total", 415, tableTop, { width: 70, align: "right" });
    doc.text("Usuário", 490, tableTop, { width: 100 });

    doc
      .moveTo(40, tableTop + 14)
      .lineTo(540, tableTop + 14)
      .stroke();

    let y = tableTop + 22;
    const linhaHeight = 16;
    const pageBottom = 780;

    doc.font("Helvetica").fontSize(9);

    let totalGeral = 0;

    saidas.forEach((m) => {
      if (y > pageBottom) {
        doc.addPage();
        y = 40;
      }

      const qtd = Number(m.quantidade || 0);
      const vlrUnit = Number(m.valor_unitario || 0);
      const total = qtd * vlrUnit;
      totalGeral += total;

      doc.text(formatDate(m.data_movimentacao), 40, y);
      doc.text(m.produto?.nome || "-", 90, y, { width: 160 });
      doc.text(qtd.toString(), 260, y, { width: 40, align: "right" });
      doc.text(m.produto?.unidade?.sigla || "-", 305, y);
      doc.text(vlrUnit.toFixed(2), 340, y, { width: 70, align: "right" });
      doc.text(total.toFixed(2), 415, y, { width: 70, align: "right" });
      doc.text(m.usuario?.nome || "-", 490, y, { width: 100 });

      y += linhaHeight;
    });

    // total geral
    doc.moveDown(1.5);
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`Total geral do período: R$ ${totalGeral.toFixed(2)}`, {
        align: "right",
      });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar relatório de saídas:", err);
    return res
      .status(500)
      .json({ error: "Erro ao gerar relatório de saídas." });
  }
}

module.exports = {
  estoqueAtual,
  entradasPeriodo,
  saiasPeriodo, // sim, o nome está assim no export; na rota vamos usar essa função
};
