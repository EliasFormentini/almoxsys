import React, { useState } from "react";
import SelecionarProdutoModal from "./SelecionarProdutoModal";
import { Trash2 } from "lucide-react";
import { criarSaida } from "../services/movimentacaoService";

const SaidaModal = ({ isOpen, onClose, onSave }) => {
  const [abaAtiva, setAbaAtiva] = useState("dados");
  const [dados, setDados] = useState({
    data_movimentacao: new Date().toISOString().split("T")[0],
    numero_nota: "",
    serie_nota: "",
    observacao: "",
  });
  const [produtos, setProdutos] = useState([]);
  const [mostrarSelecaoProduto, setMostrarSelecaoProduto] = useState(false);

  const handleChange = (e) => setDados({ ...dados, [e.target.name]: e.target.value });

  const adicionarProduto = (p) => {
    // abre a sub-modal com qty/valor? Se você já tem AdicionarProdutoModal integrado no SelecionarProdutoModal,
    // p virá com quantidade/valor_unitario/valor_total preenchidos.
    setProdutos((lst) => [...lst, p]);
    setMostrarSelecaoProduto(false);
  };

  const removerProduto = (idx) => {
    if (window.confirm("Remover este produto da lista?")) {
      setProdutos((lst) => lst.filter((_, i) => i !== idx));
    }
  };

  const handleSalvar = async () => {
    if (!dados.numero_nota) return alert("Informe o número da nota.");
    if (!produtos.length) return alert("Adicione pelo menos um produto.");

    // Posta uma movimentação por item (mesma estratégia das entradas)
    for (const item of produtos) {
      await criarSaida({
        tipo: "saida",
        id_produto: item.id_produto ?? item.id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario ?? 0,
        numero_nota: dados.numero_nota,
        serie_nota: dados.serie_nota,
        observacao: dados.observacao || null,
        data_movimentacao: dados.data_movimentacao,
      });
    }

    onSave?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        {/* Cabeçalho */}
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Nova Saída</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-200">✕</button>
        </div>

        {/* Abas */}
        <div className="flex border-b text-sm font-medium">
          <button
            onClick={() => setAbaAtiva("dados")}
            className={`flex-1 py-2 ${abaAtiva === "dados" ? "bg-blue-100" : ""}`}
          >
            Dados da Saída
          </button>
          <button
            onClick={() => setAbaAtiva("produtos")}
            className={`flex-1 py-2 ${abaAtiva === "produtos" ? "bg-blue-100" : ""}`}
          >
            Produtos
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          {abaAtiva === "dados" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm">Data</label>
                <input
                  type="date"
                  name="data_movimentacao"
                  value={dados.data_movimentacao}
                  onChange={handleChange}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm">Número da Nota</label>
                  <input
                    type="text"
                    name="numero_nota"
                    value={dados.numero_nota}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm">Série</label>
                  <input
                    type="text"
                    name="serie_nota"
                    value={dados.serie_nota}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm">Observação</label>
                <textarea
                  name="observacao"
                  value={dados.observacao}
                  onChange={handleChange}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setMostrarSelecaoProduto(true)}
                className="mb-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                + Adicionar Produto
              </button>

              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Produto</th>
                    <th className="p-2 border text-center">Qtd</th>
                    <th className="p-2 border text-center">Vlr Unit</th>
                    <th className="p-2 border text-center">Total</th>
                    <th className="p-2 border text-center w-10">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{p.nome}</td>
                      <td className="p-2 border text-center">{p.quantidade}</td>
                      <td className="p-2 border text-center">
                        {(p.valor_unitario ?? 0).toFixed(2)}
                      </td>
                      <td className="p-2 border text-center font-semibold text-blue-700">
                        {(p.valor_total ?? (p.quantidade * (p.valor_unitario ?? 0))).toFixed(2)}
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => removerProduto(i)}
                          className="text-red-600 hover:text-red-800"
                          title="Remover produto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!produtos.length && (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 italic py-2">
                        Nenhum produto adicionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar Saída
          </button>
        </div>
      </div>

      {/* Seletor de produtos (reutilizado) */}
      <SelecionarProdutoModal
        isOpen={mostrarSelecaoProduto}
        onClose={() => setMostrarSelecaoProduto(false)}
        onSelect={adicionarProduto}
      />
    </div>
  );
};

export default SaidaModal;
