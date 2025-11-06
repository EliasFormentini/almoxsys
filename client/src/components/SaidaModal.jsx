import React, { useState } from "react";
import SelecionarProdutoModal from "./SelecionarProdutoModal";
import AdicionarProdutoModal from "./AdicionarProdutoModal";
import { Trash2 } from "lucide-react";
import { criarSaida } from "../services/movimentacaoService";

const SaidaModal = ({ isOpen, onClose, onSave }) => {
  const [abaAtiva, setAbaAtiva] = useState("dados");

  // Saída não usa nota/série. Deixei data e observação.
  const [dados, setDados] = useState({
    data_movimentacao: new Date().toISOString().split("T")[0],
    observacao: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [mostrarSelecaoProduto, setMostrarSelecaoProduto] = useState(false);

  // sub-modal para informar a quantidade (valor = custo_medio fixo)
  const [produtoParaAdicionar, setProdutoParaAdicionar] = useState(null);
  const [mostrarAdicionarProduto, setMostrarAdicionarProduto] = useState(false);

  const handleChange = (e) => setDados({ ...dados, [e.target.name]: e.target.value });

  // chamado ao escolher um produto na modal de seleção
  const handleSelectProduto = (produto) => {
    // esperamos que venha com custo_medio do backend
    setProdutoParaAdicionar(produto);
    setMostrarAdicionarProduto(true);
    setMostrarSelecaoProduto(false);
  };

  // confirma (com quantidade) e adiciona à grade
  const confirmarAdicionarProduto = (itemComQtdECustos) => {
    setProdutos((lst) => [...lst, itemComQtdECustos]);
    setProdutoParaAdicionar(null);
    setMostrarAdicionarProduto(false);
  };

  const removerProduto = (idx) => {
    if (window.confirm("Remover este produto da lista?")) {
      setProdutos((lst) => lst.filter((_, i) => i !== idx));
    }
  };

  const handleSalvar = async () => {
    if (!produtos.length) {
      alert("Adicione pelo menos um produto.");
      return;
    }

    // cria uma movimentação por item
    for (const item of produtos) {
      await criarSaida({
        tipo: "saida",
        id_produto: item.id_produto ?? item.id,          // id do produto
        quantidade: item.quantidade,                     // informado na sub-modal
        valor_unitario: item.valor_unitario,             // = custo_medio (fixo)
        valor_total: item.valor_total,                   // quantidade * custo_medio
        observacao: dados.observacao || null,
        data_movimentacao: dados.data_movimentacao,
      });
    }

    onSave?.();     // recarrega lista na página
    onClose?.();    // fecha modal
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

              <div>
                <label className="block text-sm">Observação</label>
                <textarea
                  name="observacao"
                  value={dados.observacao}
                  onChange={handleChange}
                  className="border rounded-md px-2 py-1 w-full"
                  placeholder="Motivo da saída, setor, requisição, etc."
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
                    <th className="p-2 border text-center">Vlr Unit (custo médio)</th>
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

      {/* Modal: selecionar produto */}
      <SelecionarProdutoModal
        isOpen={mostrarSelecaoProduto}
        onClose={() => setMostrarSelecaoProduto(false)}
        onSelect={handleSelectProduto}
      />

      {/* Modal: informar quantidade (valor = custo_medio travado) */}
      <AdicionarProdutoModal
        isOpen={mostrarAdicionarProduto}
        produto={produtoParaAdicionar}
        modo="saida"                       // << trava o valor_unitário = custo_medio
        onConfirm={confirmarAdicionarProduto}
        onClose={() => {
          setMostrarAdicionarProduto(false);
          setProdutoParaAdicionar(null);
        }}
      />
    </div>
  );
};

export default SaidaModal;
