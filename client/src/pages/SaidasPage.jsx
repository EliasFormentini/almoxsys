import React, { useEffect, useState } from "react";
import { listarSaidas } from "../services/movimentacaoService";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SaidaModal from "../components/SaidaModal";
import { baixarRelatorioSaidasPeriodo } from "../services/relatorioService";


const SaidasPage = () => {
  const [saidas, setSaidas] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const carregarSaidas = async () => {
    try {
      const { data } = await listarSaidas();

      if (!Array.isArray(data) || data.length === 0) {
        setSaidas([]);
        return;
      }

      if (Array.isArray(data[0].itens)) {
        setSaidas(data);
        return;
      }

      const gruposMap = {};

      data.forEach((mov) => {
        if (mov.tipo !== "saida") return;

        const dataKey = mov.data_movimentacao
          ? new Date(mov.data_movimentacao).toISOString().slice(0, 10)
          : "";

        const chave = `${dataKey}-${mov.observacao || ""}`;

        if (!gruposMap[chave]) {
          gruposMap[chave] = {
            id: mov.id, // só para key no React
            data_movimentacao: mov.data_movimentacao,
            observacao: mov.observacao,
            itens: [],
          };
        }

        gruposMap[chave].itens.push({
          id: mov.id,
          quantidade: mov.quantidade,
          valor_unitario: mov.valor_unitario,
          valor_total: mov.valor_total,
          produto: mov.produto, // vem do include
        });
      });

      const agrupadas = Object.values(gruposMap);
      setSaidas(agrupadas);
    } catch (err) {
      console.error("Erro ao carregar saídas:", err);
      setSaidas([]);
    }


    // helper mantém
    const getItens = (grupo) =>
      grupo.itens || grupo.produtos || grupo.saida_itens || [];

    // idem
    const calcularValorTotal = (grupo) => {
      const itens = getItens(grupo);

      return itens.reduce((acc, it) => {
        const valorTotalItem =
          Number(it.valor_total) ||
          Number(it.valor_unitario || 0) * Number(it.quantidade || 0);

        return acc + (isNaN(valorTotalItem) ? 0 : valorTotalItem);
      }, 0);
    };

  };


  useEffect(() => {
    carregarSaidas();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Garante que pegamos o array correto de itens independente do nome
  const getItens = (grupo) =>
    grupo.itens || grupo.produtos || grupo.saida_itens || [];

  // Calcula o total da saída
  const calcularValorTotal = (grupo) => {
    const itens = getItens(grupo);

    return itens.reduce((acc, it) => {
      const valorTotalItem =
        Number(it.valor_total) ||
        Number(it.valor_unitario || 0) * Number(it.quantidade || 0);

      return acc + (isNaN(valorTotalItem) ? 0 : valorTotalItem);
    }, 0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Saídas</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          />
          <span className="text-gray-600 text-sm">até</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          />

          <button
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md font-medium shadow-sm"
            onClick={() => {
              if (!dataInicio || !dataFim) {
                alert("Informe o período para gerar o relatório.");
                return;
              }
              baixarRelatorioSaidasPeriodo(dataInicio, dataFim);
            }}
          >
            Imprimir PDF

          </button>
          <button
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
            onClick={() => setMostrarModal(true)}
          >
            Nova Saída
          </button>
        </div>
      </div>
      {mostrarModal && (
        <SaidaModal
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onSave={async () => {
            setMostrarModal(false);
            await carregarSaidas();
          }}
        />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 border-b text-left">Data</th>
              <th className="px-4 py-3 border-b text-left">Observação</th>
              <th className="px-4 py-3 border-b text-right">Valor Total</th>
              <th className="px-4 py-3 border-b text-center w-16">Ações</th>
            </tr>
          </thead>
          <tbody>
            {saidas.length ? (
              saidas.map((grupo) => {
                const itens = getItens(grupo);
                const valorTotal = calcularValorTotal(grupo);

                return (
                  <React.Fragment key={grupo.id}>
                    {/* Linha principal da saída */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 border-b">
                        {grupo.data_movimentacao
                          ? new Date(grupo.data_movimentacao).toLocaleDateString(
                            "pt-BR"
                          )
                          : "--/--/----"}
                      </td>
                      <td className="px-4 py-2 border-b max-w-xl truncate">
                        {grupo.observacao || "—"}
                      </td>
                      <td className="px-4 py-2 border-b text-right font-semibold">
                        {valorTotal > 0
                          ? valorTotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                          : "R$ 0,00"}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        <button
                          onClick={() => toggleExpand(grupo.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedId === grupo.id ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Itens da saída */}
                    {expandedId === grupo.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="p-0">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left">Produto</th>
                                <th className="px-4 py-2 text-center">Quantidade</th>
                                <th className="px-4 py-2 text-right">
                                  Valor Unitário
                                </th>
                                <th className="px-4 py-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itens.length ? (
                                itens.map((it, idx) => {
                                  const totalItem =
                                    Number(it.valor_total) ||
                                    Number(it.valor_unitario || 0) *
                                    Number(it.quantidade || 0);

                                  return (
                                    <tr key={idx} className="border-t">
                                      <td className="px-4 py-2 border-b">
                                        {it.produto?.nome ||
                                          it.nome_produto ||
                                          "—"}
                                      </td>
                                      <td className="px-4 py-2 border-b text-center">
                                        {it.quantidade || 0}
                                      </td>
                                      <td className="px-4 py-2 border-b text-right">
                                        {Number(
                                          it.valor_unitario || 0
                                        ).toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                      </td>
                                      <td className="px-4 py-2 border-b text-right text-blue-700 font-medium">
                                        {Number(
                                          isNaN(totalItem) ? 0 : totalItem
                                        ).toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="text-center text-gray-500 italic py-2"
                                  >
                                    Nenhum item nesta saída.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  Nenhuma saída encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaidasPage;
