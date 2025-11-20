// src/services/relatorioService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/relatorios";

// ESTOQUE ATUAL (já feito antes)
export const baixarRelatorioEstoque = async () => {
  const resp = await axios.get(`${API_URL}/estoque-atual`, {
    responseType: "blob",
  });

  const blob = new Blob([resp.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "relatorio-estoque-atual.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// ENTRADAS POR PERÍODO
export const baixarRelatorioEntradasPeriodo = async (dataInicio, dataFim) => {
  const resp = await axios.get(`${API_URL}/entradas-periodo`, {
    params: { dataInicio, dataFim },
    responseType: "blob",
  });

  const blob = new Blob([resp.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-entradas-${dataInicio}_a_${dataFim}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// SAÍDAS POR PERÍODO
export const baixarRelatorioSaidasPeriodo = async (dataInicio, dataFim) => {
  const resp = await axios.get(`${API_URL}/saidas-periodo`, {
    params: { dataInicio, dataFim },
    responseType: "blob",
  });

  const blob = new Blob([resp.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-saidas-${dataInicio}_a_${dataFim}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

//PEDIDOS
export const baixarRelatorioPedido = async (idPedido) => {
  try {
    const response = await axios.get(`${API_URL}/pedido/${idPedido}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pedido_${idPedido}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Erro ao baixar relatório do pedido:", error);
    throw error;
  }
};