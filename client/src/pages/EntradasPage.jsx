import React, { useEffect, useState } from "react";
import { listarEntradas, criarEntrada } from "../services/movimentacaoService";
import EntradaModal from "../components/EntradaModal";
import { ChevronDown, ChevronUp } from "lucide-react";

const EntradasPage = () => {
  const [entradas, setEntradas] = useState([]);
  const [expandida, setExpandida] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarEntradas = async () => {
    try {
      const res = await listarEntradas();
      const agrupadas = agruparPorNota(res.data);
      setEntradas(agrupadas);
    } catch (err) {
      console.error("Erro ao carregar entradas:", err);
    }
  };

  const agruparPorNota = (dados) => {
    const grupos = {};
    dados.forEach((mov) => {
      const chave = `${mov.numero_nota}-${mov.serie_nota}`;
      if (!grupos[chave])
        grupos[chave] = {
          numero_nota: mov.numero_nota,
          serie_nota: mov.serie_nota,
          fornecedor: mov.Fornecedor?.nome || "—",
          data_movimentacao: mov.data_movimentacao,
          produtos: [],
        };
      grupos[chave].produtos.push(mov);
    });
    return Object.values(grupos);
  };

  const handleSalvar = async (entrada) => {
    try {
      await criarEntrada(entrada);
      await carregarEntradas();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar entrada:", err);
      alert("Erro ao salvar entrada.");
    }
  };

  useEffect(() => {
    carregarEntradas();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Entradas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md shadow-sm"
        >
          Nova Entrada
        </button>
      </div>

      <table className="w-full border bg-white shadow-sm">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="p-2 border">Nº Nota</th>
            <th className="p-2 border">Série</th>
            <th className="p-2 border">Fornecedor</th>
            <th className="p-2 border">Data</th>
            <th className="p-2 border text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((e, i) => (
            <React.Fragment key={i}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setExpandida(expandida === i ? null : i)
                }
              >
                <td className="p-2 border text-center">{e.numero_nota}</td>
                <td className="p-2 border text-center">{e.serie_nota}</td>
                <td className="p-2 border">{e.fornecedor}</td>
                <td className="p-2 border text-center">
                  {new Date(e.data_movimentacao).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  {expandida === i ? <ChevronUp /> : <ChevronDown />}
                </td>
              </tr>

              {expandida === i && (
                <tr>
                  <td colSpan="5" className="p-0 bg-gray-50">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2 border">Produto</th>
                          <th className="p-2 border text-center">Qtd</th>
                          <th className="p-2 border text-center">Vlr Unit</th>
                          <th className="p-2 border text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {e.produtos.map((p) => (
                          <tr key={p.id}>
                            <td className="p-2 border">{p.Produto?.nome}</td>
                            <td className="p-2 border text-center">{p.quantidade}</td>
                            <td className="p-2 border text-center">{p.valor_unitario}</td>
                            <td className="p-2 border text-center font-semibold text-blue-700">
                              {p.valor_total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <EntradaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
      />
    </div>
  );
};

export default EntradasPage;
 