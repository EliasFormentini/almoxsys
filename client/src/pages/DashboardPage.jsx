import React, { useEffect, useState } from "react";
import { getDashboardResumo } from "../services/dashboardService";
import { useToast } from "../contexts/ToastContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const carregar = async () => {
      try {
        const { data } = await getDashboardResumo();
        setDados(data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        showToast({
          type: "error",
          title: "Erro ao carregar",
          message: "Não foi possível carregar os dados do dashboard.",
        });
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  if (!dados) {
    return <p>Sem dados para exibir.</p>;
  }

  const { cards, chartEntradasSaidas, topProdutosSaida } = dados;

  const lineData = {
    labels: chartEntradasSaidas.labels,
    datasets: [
      {
        label: "Entradas (R$)",
        data: chartEntradasSaidas.entradas,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Saídas (R$)",
        data: chartEntradasSaidas.saidas,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: topProdutosSaida.map((p) => p.nome),
    datasets: [
      {
        label: "Quantidade saída",
        data: topProdutosSaida.map((p) => p.quantidade),
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  const valor = (n) =>
    Number(n || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Dashboard do Almoxarifado
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Produtos ativos</p>
          <p className="text-2xl font-bold text-gray-800">
            {cards.totalProdutosAtivos}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Itens em estoque</p>
          <p className="text-2xl font-bold text-gray-800">
            {cards.estoqueTotalItens}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Valor total em estoque</p>
          <p className="text-xl font-semibold text-emerald-600">
            {valor(cards.valorTotalEstoque)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Produtos abaixo do mínimo</p>
          <p className="text-2xl font-bold text-red-600">
            {cards.produtosAbaixoMinimo}
          </p>
        </div>
      </div>

      {/* Cards de movimentações/pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Entradas no mês (R$)</p>
          <p className="text-xl font-semibold text-emerald-600">
            {valor(cards.entradasMes)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Saídas no mês (R$)</p>
          <p className="text-xl font-semibold text-blue-600">
            {valor(cards.saidasMes)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">Pedidos</p>
          <p className="text-sm text-gray-700">
            Pendentes:{" "}
            <span className="font-bold text-amber-600">
              {cards.pedidosPendentes}
            </span>{" "}
            • Aprovados:{" "}
            <span className="font-bold text-emerald-600">
              {cards.pedidosAprovados}
            </span>{" "}
            • Atendidos:{" "}
            <span className="font-bold text-blue-600">
              {cards.pedidosAtendidos}
            </span>
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Entradas x Saídas (últimos 12 meses)
          </h2>
          <Line data={lineData} />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Top produtos por saída
          </h2>
          {topProdutosSaida.length ? (
            <Bar data={barData} />
          ) : (
            <p className="text-xs text-gray-500">
              Ainda não há dados de saídas suficientes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
