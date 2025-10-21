import axios from "axios";

const API_URL = "http://localhost:3000/api/movimentacoes";

export const listarEntradas = () => axios.get(`${API_URL}?tipo=entrada`);

export const criarMovimentacao = (movimentacao) => axios.post(API_URL, movimentacao);

export const listarProdutosEntrada = (numero_nota, serie_nota) =>
  axios.get(`${API_URL}?tipo=entrada&numero_nota=${numero_nota}&serie_nota=${serie_nota}`);
