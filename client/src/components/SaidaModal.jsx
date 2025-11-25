import React, { useState } from "react";
import SelecionarProdutoModal from "./SelecionarProdutoModal";
import AdicionarProdutoModal from "./AdicionarProdutoModal";
import { Trash2 } from "lucide-react";
import { criarSaida } from "../services/movimentacaoService";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../contexts/ToastContext";

const SaidaModal = ({ isOpen, onClose, onSave }) => {
  const [abaAtiva, setAbaAtiva] = useState("dados");

  const [dados, setDados] = useState({
    data_movimentacao: new Date().toISOString().split("T")[0],
    observacao: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [mostrarSelecaoProduto, setMostrarSelecaoProduto] = useState(false);

  const [produtoParaAdicionar, setProdutoParaAdicionar] = useState(null);
  const [mostrarAdicionarProduto, setMostrarAdicionarProduto] = useState(false);

  const { alert, confirm, AlertComponent } = useAlert();
  const { showToast } = useToast();

  const handleChange = (e) =>
    setDados({ ...dados, [e.target.name]: e.target.value });

  const handleSelectProduto = (produto) => {
    setProdutoParaAdicionar(produto);
    setMostrarAdicionarProduto(true);
    setMostrarSelecaoProduto(false);
  };

  const confirmarAdicionarProduto = (itemComQtdECustos) => {
    setProdutos((lst) => [...lst, itemComQtdECustos]);
    setProdutoParaAdicionar(null);
    setMostrarAdicionarProduto(false);
  };

  const removerProduto = async (idx) => {
    const ok = await confirm({
      title: "Remover produto",
      message: "Deseja realmente remover este produto da lista?",
      type: "warning",
    });

    if (!ok) return;

    setProdutos((lst) => lst.filter((_, i) => i !== idx));
  };

  const handleSalvar = async () => {
    try {
      if (!dados.data_movimentacao) {
        await alert({
          title: "Data obrigatória",
          message: "Informe a data da saída.",
          type: "warning",
        });
        setAbaAtiva("dados");
        return;
      }

      if (!produtos.length) {
        await alert({
          title: "Nenhum produto",
          message: "Adicione pelo menos um produto para registrar a saída.",
          type: "warning",
        });
        setAbaAtiva("produtos");
        return;
      }

      for (const item of produtos) {
        const id_produto = item.id_produto || item.id || item.produto_id;
        const quantidade = Number(item.quantidade || 0);

        if (!id_produto || quantidade <= 0) {
          console.error("Item inválido ao salvar saída:", item);
          await alert({
            title: "Item inválido",
            message:
              "Erro ao montar a saída: produto ou quantidade inválidos. Verifique a lista de produtos.",
            type: "error",
          });
          return;
        }

        const payload = {
          tipo: "saida",
          id_produto,
          quantidade,
          valor_unitario: item.valor_unitario,
          observacao: dados.observacao || null,
          data_movimentacao: dados.data_movimentacao,
        };

        console.log("Enviando saída:", payload);
        await criarSaida(payload);
      }

      showToast({
        type: "success",
        title: "Saída registrada",
        message: "Saída registrada com sucesso e estoque atualizado.",
      });

      onSave?.();
      onClose?.();
    } catch (err) {
      console.error(
        "Erro ao salvar saída:",
        err.response?.data || err.message || err
      );

      await alert({
        title: "Erro ao salvar saída",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Erro ao salvar saída. Veja o console para detalhes.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
          {/* Cabeçalho */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Nova Saída</h2>
            <button
              onClick={onClose}
              className="text-xl hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Abas */}
          <div className="flex border-b text-sm font-medium">
            <button
              onClick={() => setAbaAtiva("dados")}
              className={`flex-1 py-2 ${
                abaAtiva === "dados" ? "bg-blue-100" : ""
              }`}
            >
              Dados da Saída
            </button>
            <button
              onClick={() => setAbaAtiva("produtos")}
              className={`flex-1 py-2 ${
                abaAtiva === "produtos" ? "bg-blue-100" : ""
              }`}
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
                      <th className="p-2 border text-center">
                        Vlr Unit (custo médio)
                      </th>
                      <th className="p-2 border text-center">Total</th>
                      <th className="p-2 border text-center w-10">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p, i) => {
                      const total =
                        p.valor_total ??
                        (p.quantidade || 0) * (p.valor_unitario ?? 0);

                      return (
                        <tr key={i}>
                          <td className="p-2 border">{p.nome}</td>
                          <td className="p-2 border text-center">
                            {p.quantidade}
                          </td>
                          <td className="p-2 border text-center">
                            {(p.valor_unitario ?? 0).toFixed(2)}
                          </td>
                          <td className="p-2 border text-center font-semibold text-blue-700">
                            {total.toFixed(2)}
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
                      );
                    })}
                    {!produtos.length && (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-gray-500 italic py-2"
                        >
                          Nenhum produto adicionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
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

        <SelecionarProdutoModal
          isOpen={mostrarSelecaoProduto}
          onClose={() => setMostrarSelecaoProduto(false)}
          onSelect={handleSelectProduto}
        />

        <AdicionarProdutoModal
          isOpen={mostrarAdicionarProduto}
          produto={produtoParaAdicionar}
          modo="saida" 
          onConfirm={confirmarAdicionarProduto}
          onClose={() => {
            setMostrarAdicionarProduto(false);
            setProdutoParaAdicionar(null);
          }}
        />
      </div>

      {AlertComponent}
    </>
  );
};

export default SaidaModal;
