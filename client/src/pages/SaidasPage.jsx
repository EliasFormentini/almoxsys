import React, { useEffect, useState } from "react";
import { listarSaidas } from "../services/movimentacaoService";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SaidaModal from "../components/SaidaModal";

const SaidasPage = () => {
  const [saidas, setSaidas] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const carregarSaidas = async () => {
    try {
      const { data } = await listarSaidas();
      setSaidas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar saídas:", err);
    }
  };

  useEffect(() => {
    carregarSaidas();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Saídas</h1>
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
          onClick={() => setMostrarModal(true)}
        >
          Nova Saída
        </button>
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
              <th className="px-4 py-3 border-b text-left">Nº Nota</th>
              <th className="px-4 py-3 border-b text-left">Série</th>
              <th className="px-4 py-3 border-b text-left">Data</th>
              <th className="px-4 py-3 border-b text-right">Valor Total</th>
              <th className="px-4 py-3 border-b text-center w-16">Ações</th>
            </tr>
          </thead>
          <tbody>
            {saidas.length ? (
              saidas.map((grupo) => {
                const valorTotal = grupo.itens?.reduce(
                  (acc, it) => acc + Number(it.valor_total || 0),
                  0
                );

                return (
                  <React.Fragment key={`${grupo.numero_nota}-${grupo.serie_nota}-${grupo.id}`}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 border-b">{grupo.numero_nota}</td>
                      <td className="px-4 py-2 border-b">{grupo.serie_nota}</td>
                      <td className="px-4 py-2 border-b">
                        {new Date(grupo.data_movimentacao).toLocaleDateString("pt-BR")}
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
                          onClick={() => toggleExpand(grupo.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedId === grupo.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </td>
                    </tr>

                    {expandedId === grupo.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="p-0">
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
                              {grupo.itens?.length ? (
                                grupo.itens.map((it, idx) => (
                                  <tr key={idx} className="border-t">
                                    <td className="px-4 py-2 border-b">{it.produto?.nome || "—"}</td>
                                    <td className="px-4 py-2 border-b text-center">{it.quantidade}</td>
                                    <td className="px-4 py-2 border-b text-right">
                                      {Number(it.valor_unitario || 0).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </td>
                                    <td className="px-4 py-2 border-b text-right text-blue-700 font-medium">
                                      {Number(it.valor_total || 0).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center text-gray-500 italic py-2">
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
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500 italic">
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
