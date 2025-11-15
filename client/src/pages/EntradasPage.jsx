import React, { useEffect, useState } from "react";
import { listarEntradas, criarEntrada } from "../services/movimentacaoService";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import EntradaModal from "../components/EntradaModal";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../contexts/ToastContext";

const EntradasPage = () => {
  const [entradas, setEntradas] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const { alert, confirm, AlertComponent } = useAlert();
  const { showToast } = useToast();

  const carregarEntradas = async () => {
    try {
      const response = await listarEntradas();
      setEntradas(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar entradas:", error);

      showToast({
        type: "error",
        title: "Erro ao carregar",
        message: "Não foi possível carregar as entradas.",
      });
    }
  };

  useEffect(() => {
    carregarEntradas();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-2xl font-semibold text-gray-800">Entradas</h1>
          <button
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
            onClick={() => setMostrarModal(true)}
          >
            Nova Entrada
          </button>
        </div>

        {/* Modal */}
        {mostrarModal && (
          <EntradaModal
            isOpen={mostrarModal}
            onClose={() => setMostrarModal(false)}
            onSave={async (entrada) => {
              try {
                await criarEntrada(entrada);
                await carregarEntradas();

                showToast({
                  type: "success",
                  title: "Entrada criada",
                  message: "A entrada foi registrada com sucesso!",
                });

                setMostrarModal(false);
              } catch (err) {
                console.error("Erro ao salvar entrada:", err);

                await alert({
                  title: "Erro ao salvar entrada",
                  message:
                    err.response?.data?.error ||
                    "Não foi possível salvar a entrada.",
                  type: "error",
                });
              }
            }}
          />
        )}

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 border-b text-left">Nº Nota</th>
                <th className="px-4 py-3 border-b text-left">Série</th>
                <th className="px-4 py-3 border-b text-left">Fornecedor</th>
                <th className="px-4 py-3 border-b text-left">Data</th>
                <th className="px-4 py-3 border-b text-right">Valor Total</th>
                <th className="px-4 py-3 border-b text-center w-16">Ações</th>
              </tr>
            </thead>

            <tbody>
              {entradas.length > 0 ? (
                entradas.map((entrada) => {
                  const valorTotal = entrada.itens?.reduce(
                    (acc, item) => acc + Number(item.valor_total || 0),
                    0
                  );

                  return (
                    <React.Fragment key={entrada.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 border-b">{entrada.numero_nota}</td>
                        <td className="px-4 py-2 border-b">{entrada.serie_nota}</td>
                        <td className="px-4 py-2 border-b">
                          {entrada.fornecedor?.nome || "—"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {new Date(entrada.data_movimentacao).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-2 border-b text-right font-semibold">
                          {valorTotal
                            ? valorTotal.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : "R$ 0,00"}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          <button
                            onClick={() => toggleExpand(entrada.id)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            {expandedId === entrada.id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        </td>
                      </tr>

                      {expandedId === entrada.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="p-0">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left">Produto</th>
                                  <th className="px-4 py-2 text-center">Qtd</th>
                                  <th className="px-4 py-2 text-right">Vlr Unit</th>
                                  <th className="px-4 py-2 text-right">Total</th>
                                </tr>
                              </thead>

                              <tbody>
                                {entrada.itens?.length > 0 ? (
                                  entrada.itens.map((item, index) => (
                                    <tr key={index} className="border-t">
                                      <td className="px-4 py-2 border-b">
                                        {item.produto?.nome || "—"}
                                      </td>
                                      <td className="px-4 py-2 border-b text-center">
                                        {item.quantidade}
                                      </td>
                                      <td className="px-4 py-2 border-b text-right">
                                        {Number(item.valor_unitario || 0).toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                      </td>
                                      <td className="px-4 py-2 border-b text-right text-blue-700 font-medium">
                                        {Number(item.valor_total || 0).toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="text-center text-gray-500 italic py-2"
                                    >
                                      Nenhum produto vinculado.
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
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-500 italic"
                  >
                    Nenhuma entrada encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {AlertComponent}
    </>
  );
};

export default EntradasPage;
