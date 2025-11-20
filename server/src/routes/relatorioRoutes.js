// src/routes/relatorioRoutes.js
const express = require("express");
const router = express.Router();

const relatorioController = require("../controllers/relatorioController");
const authMiddleware = require("../middlewares/authMiddleware");
const permission = require("../middlewares/permissionMiddleware");

// 🔹 imports necessários para o relatório de pedido
const PDFDocument = require("pdfkit");
const { Pedido, ItemPedido, Produto, Usuario } = require("../models");

// precisa estar logado
router.use(authMiddleware);
// precisa ter deck RELATORIOS (ou ser admin, dependendo do middleware)
router.use(permission("RELATORIOS"));

// GET /api/relatorios/estoque-atual
router.get("/estoque-atual", relatorioController.estoqueAtual);

// GET /api/relatorios/entradas-periodo?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
router.get("/entradas-periodo", relatorioController.entradasPeriodo);

// GET /api/relatorios/saidas-periodo?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
// (se no controller o nome for saidasPeriodo, ajuste aqui também)
router.get("/saidas-periodo", relatorioController.saiasPeriodo);

// GET /api/relatorios/pedido/:id
router.get("/pedido/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nome", "email"],
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

    const usuarioSolicitante = pedido.usuario?.nome || "—";

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=pedido_${pedido.id}.pdf`
    );

    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(16).text("Pedido de Compra", { align: "center" });
    doc.moveDown();

    // Dados principais
    doc.fontSize(12).text(`Nº Pedido: ${pedido.id}`);
    doc.text(
      `Data: ${
        pedido.data_pedido
          ? new Date(pedido.data_pedido).toLocaleDateString("pt-BR")
          : "—"
      }`
    );
    doc.text(`Tipo: ${pedido.tipo}`);
    doc.text(`Status: ${pedido.status}`);
    doc.text(`Usuário solicitante: ${usuarioSolicitante}`);
    doc.moveDown();

    // Itens
    doc.fontSize(12).text("Itens do Pedido", { underline: true });
    doc.moveDown(0.5);

    if (!pedido.itens || pedido.itens.length === 0) {
      doc.text("Nenhum item vinculado.");
    } else {
      pedido.itens.forEach((item) => {
        const nomeProduto = item.produto?.nome || `Produto ${item.id_produto}`;
        const qtd = item.quantidade;
        const vu = Number(item.valor_unitario || 0);
        const vt = Number(item.valor_total || 0);

        doc.text(
          `${qtd} x ${nomeProduto} | Unit: R$ ${vu.toFixed(
            2
          )} | Total: R$ ${vt.toFixed(2)}`
        );
      });
    }

    doc.moveDown();

    const valorTotal = Number(pedido.valor_total || 0);
    doc.text(`Valor total do pedido: R$ ${valorTotal.toFixed(2)}`, {
      align: "right",
    });

    doc.moveDown(3);

    // Assinaturas
    doc.text("____________________________________", { align: "left" });
    doc.text("Solicitante", { align: "left" });

    doc.moveDown(2);

    doc.text("____________________________________", { align: "left" });
    doc.text("Responsável pela aprovação", { align: "left" });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório de pedido:", error);
    res.status(500).json({
      error: "Erro ao gerar relatório de pedido",
      details: error.message,
    });
  }
});

module.exports = router;
