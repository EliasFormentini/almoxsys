import React, { useState } from "react";
import SelecionarProdutoModal from "./SelecionarProdutoModal";
import AdicionarProdutoModal from "./AdicionarProdutoModal";
import SelecionarFornecedorModal from "./SelecionarFornecedorModal";
import { Trash2 } from "lucide-react";

const EntradaModal = ({ isOpen, onClose, onSave }) => {
  const [abaAtiva, setAbaAtiva] = useState("dados");
  const [dadosEntrada, setDadosEntrada] = useState({
    data_movimentacao: new Date().toISOString().split("T")[0],
    numero_nota: "",
    serie_nota: "",
    id_fornecedor: "",
    fornecedor_nome: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [mostrarSelecaoProduto, setMostrarSelecaoProduto] = useState(false);
  const [mostrarAdicionarProduto, setMostrarAdicionarProduto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarSelecaoFornecedor, setMostrarSelecaoFornecedor] = useState(false);

  const handleChange = (e) => {
    setDadosEntrada({ ...dadosEntrada, [e.target.name]: e.target.value });
  };

  const removerProduto = (index) => {
    if (window.confirm("Remover este produto da lista?")) {
      setProdutos(produtos.filter((_, i) => i !== index));
    }
  };

  const handleSalvar = () => {
    if (!dadosEntrada.numero_nota) {
      alert("Informe o número da nota.");
      return;
    }

    if (!dadosEntrada.id_fornecedor) {
      alert("Selecione o fornecedor.");
      return;
    }

    if (produtos.length === 0) {
      alert("Adicione pelo menos um produto.");
      return;
    }

    onSave({
      ...dadosEntrada,
      produtos,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        {/* Cabeçalho */}
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold">Nova Entrada</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-200">
            ✕
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b text-sm font-medium">
          <button
            onClick={() => setAbaAtiva("dados")}
            className={`flex-1 py-2 ${abaAtiva === "dados" ? "bg-blue-100" : ""}`}
          >
            Dados da Entrada
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
                  value={dadosEntrada.data_movimentacao}
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
                    value={dadosEntrada.numero_nota}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm">Série</label>
                  <input
                    type="text"
                    name="serie_nota"
                    value={dadosEntrada.serie_nota}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm">Fornecedor</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={dadosEntrada.fornecedor_nome || ""}
                    className="border rounded-md px-2 py-1 flex-1 bg-gray-100"
                    placeholder="Selecione via lupa"
                  />
                  <button
                    onClick={() => setMostrarSelecaoFornecedor(true)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    🔍
                  </button>
                </div>
                {dadosEntrada.id_fornecedor && (
                  <p className="text-xs text-gray-600 mt-1">
                    Fornecedor ID: {dadosEntrada.id_fornecedor}
                  </p>
                )}
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
                        {p.valor_unitario.toFixed(2)}
                      </td>
                      <td className="p-2 border text-center font-semibold text-blue-700">
                        {p.valor_total.toFixed(2)}
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
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé */}
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
            Salvar Entrada
          </button>
        </div>
      </div>

      {/* Modais */}
      <SelecionarProdutoModal
        isOpen={mostrarSelecaoProduto}
        onClose={() => setMostrarSelecaoProduto(false)}
        onSelect={(produto) => {
          setProdutoSelecionado(produto);
          setMostrarSelecaoProduto(false);
          setMostrarAdicionarProduto(true);
        }}
      />

      <AdicionarProdutoModal
        isOpen={mostrarAdicionarProduto}
        produto={produtoSelecionado}
        onClose={() => setMostrarAdicionarProduto(false)}
        onConfirm={(novoProduto) => {
          setProdutos([...produtos, novoProduto]);
          setMostrarAdicionarProduto(false);
        }}
      />

      <SelecionarFornecedorModal
        isOpen={mostrarSelecaoFornecedor}
        onClose={() => setMostrarSelecaoFornecedor(false)}
        onSelect={(f) => {
          setDadosEntrada({
            ...dadosEntrada,
            id_fornecedor: f.id,
            fornecedor_nome: f.nome,
          });
          setMostrarSelecaoFornecedor(false);
        }}
      />
    </div>
  );
};

export default EntradaModal;
