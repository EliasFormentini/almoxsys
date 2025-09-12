const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { Produto, Movimentacao, Categoria, Unidade } = require("../models");
const { Op } = require("sequelize");

const relatorioController = {
  // Relatório de entradas e saídas por período
  async movimentacoesPorPeriodo(req, res) {
    try {
      const { data_inicio, data_fim, formato } = req.query;

      if (!data_inicio || !data_fim)
        return res.status(400).json({ error: "Informe data_inicio e data_fim" });

      const movimentacoes = await Movimentacao.findAll({
        where: {
          data_movimentacao: {
            [Op.between]: [new Date(data_inicio), new Date(data_fim)],
          },
        },
        include: [
          { model: Produto, attributes: ["nome"] },
        ],
        order: [["data_movimentacao", "ASC"]],
      });

      if (formato === "excel") {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Movimentacoes");

        sheet.columns = [
          { header: "ID", key: "id", width: 10 },
          { header: "Produto", key: "produto", width: 30 },
          { header: "Tipo", key: "tipo", width: 15 },
          { header: "Quantidade", key: "quantidade", width: 15 },
          { header: "Data", key: "data", width: 20 },
        ];

        movimentacoes.forEach((mov) => {
          sheet.addRow({
            id: mov.id,
            produto: mov.Produto.nome,
            tipo: mov.tipo,
            quantidade: mov.quantidade,
            data: mov.data_movimentacao.toISOString().split("T")[0],
          });
        });

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="movimentacoes.xlsx"`
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        await workbook.xlsx.write(res);
        res.end();
      } else {
        // PDF
        const doc = new PDFDocument();
        res.setHeader("Content-Disposition", "attachment; filename=movimentacoes.pdf");
        res.setHeader("Content-Type", "application/pdf");

        doc.fontSize(16).text("Relatório de Movimentações", { align: "center" });
        doc.moveDown();

        movimentacoes.forEach((mov) => {
          doc
            .fontSize(12)
            .text(
              `ID: ${mov.id} | Produto: ${mov.Produto.nome} | Tipo: ${mov.tipo} | Quantidade: ${mov.quantidade} | Data: ${mov.data_movimentacao.toISOString().split("T")[0]}`
            );
        });

        doc.pipe(res);
        doc.end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar relatório" });
    }
  },

  // Relatório de estoque atual
  async estoqueAtual(req, res) {
    try {
      const { formato } = req.query;

      const produtos = await Produto.findAll({
        include: [
          { model: Categoria, attributes: ["nome"] },
          { model: Unidade, attributes: ["sigla"] },
        ],
        order: [["nome", "ASC"]],
      });

      if (formato === "excel") {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Estoque");

        sheet.columns = [
          { header: "ID", key: "id", width: 10 },
          { header: "Produto", key: "nome", width: 30 },
          { header: "Categoria", key: "categoria", width: 20 },
          { header: "Unidade", key: "unidade", width: 10 },
          { header: "Estoque Atual", key: "estoque", width: 15 },
          { header: "Estoque Mínimo", key: "minimo", width: 15 },
        ];

        produtos.forEach((p) => {
          sheet.addRow({
            id: p.id,
            nome: p.nome,
            categoria: p.Categoria.nome,
            unidade: p.Unidade.sigla,
            estoque: p.estoque_atual,
            minimo: p.estoque_minimo,
          });
        });

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="estoque_atual.xlsx"`
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        await workbook.xlsx.write(res);
        res.end();
      } else {
        // PDF
        const doc = new PDFDocument();
        res.setHeader("Content-Disposition", "attachment; filename=estoque_atual.pdf");
        res.setHeader("Content-Type", "application/pdf");

        doc.fontSize(16).text("Relatório de Estoque Atual", { align: "center" });
        doc.moveDown();

        produtos.forEach((p) => {
          doc
            .fontSize(12)
            .text(
              `ID: ${p.id} | Produto: ${p.nome} | Categoria: ${p.Categoria.nome} | Unidade: ${p.Unidade.sigla} | Estoque Atual: ${p.estoque_atual} | Estoque Mínimo: ${p.estoque_minimo}`
            );
        });

        doc.pipe(res);
        doc.end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar relatório de estoque" });
    }
  },
};

module.exports = relatorioController;
