// src/components/PedidoModal.jsx
import React, { useState, useMemo } from "react";
import SelecionarProdutoModal from "./SelecionarProdutoModal";

const PedidoModal = ({ isOpen, onClose, onSave }) => {
  const [tipo, setTipo] = useState("compra");
  const [observacao, setObservacao] = useState("");
  const [itens, setItens] = useState([]);
  const [mostrarSelecaoProduto, setMostrarSelecaoProduto] = useState(false);

  if (!isOpen) return null;

  const adicionarProduto = (produto) => {
    // Impede duplicado: se já existir, só aumenta a quantidade
    const jaExiste = itens.find((i) => i.id_produto === produto.id);

    if (jaExiste) {
      const atualizados = itens.map((i) =>
        i.id_produto === produto.id
          ? {
            ...i,
            quantidade: i.quantidade + 1,
            valor_total: (i.quantidade + 1) * i.valor_unitario,
          }
          : i
      );
      setItens(atualizados);
    } else {
      const novoItem = {
        id_produto: produto.id,
        produto, // objeto completo, usado só no front
        quantidade: 1,
        valor_unitario: 0,
        valor_total: 0,
      };
      setItens([...itens, novoItem]);
    }

    setMostrarSelecaoProduto(false);
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...itens];
    let novoValor = valor;

    if (campo === "quantidade") {
      novoValor = parseInt(valor || "0", 10);
      if (isNaN(novoValor) || novoValor < 0) novoValor = 0;
      novosItens[index].quantidade = novoValor;
    } else if (campo === "valor_unitario") {
      novoValor = parseFloat(valor.replace(",", ".") || "0");
      if (isNaN(novoValor) || novoValor < 0) novoValor = 0;
      novosItens[index].valor_unitario = novoValor;
    }

    const qtd = novosItens[index].quantidade || 0;
    const vlrUnit = novosItens[index].valor_unitario || 0;
    novosItens[index].valor_total = qtd * vlrUnit;

    setItens(novosItens);
  };

  const removerItem = (index) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const valorTotalPedido = useMemo(
    () =>
      itens.reduce((acc, item) => acc + Number(item.valor_total || 0), 0),
    [itens]
  );

  const handleSalvar = () => {
    if (itens.length === 0) {
      alert("Adicione pelo menos um produto ao pedido.");
      return;
    }

    const payload = {
      tipo,
      observacao,
      items: itens.map((item) => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
      })),
    };

    onSave && onSave(payload);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold">Novo Pedido de Compra</h2>
            <button onClick={onClose} className="text-xl hover:text-gray-200">
              ✕
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* Dados do pedido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo do Pedido
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="compra">Compra</option>
                  <option value="retirada">Retirada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observação
                </label>
                <input
                  type="text"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Observações gerais do pedido (opcional)"
                />
              </div>
            </div>

            {/* Itens */}
            <div className="border rounded-md">
              <div className="flex justify-between items-center px-3 py-2 bg-gray-100 border-b">
                <span className="font-medium text-gray-700 text-sm">
                  Itens do Pedido
                </span>
                <button
                  onClick={() => setMostrarSelecaoProduto(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md text-sm"
                >
                  Adicionar Produto
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2 text-left">Produto</th>
                      <th className="border p-2 text-center w-24">Qtd</th>
                      <th className="border p-2 text-right w-32">Vlr Unit</th>
                      <th className="border p-2 text-right w-32">Total</th>
                      <th className="border p-2 text-center w-20">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.length > 0 ? (
                      itens.map((item, index) => (
                        <tr key={item.id_produto} className="hover:bg-gray-50">
                          <td className="border p-2">
                            {item.produto?.nome || `ID ${item.id_produto}`}
                          </td>

                          <td className="border p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.quantidade}
                              onChange={(e) =>
                                atualizarItem(index, "quantidade", e.target.value)
                              }
                              className="w-20 border rounded px-1 py-1 text-center text-sm"
                            />
                          </td>

                          <td className="border p-2 text-right">
                            <input
                              type="text"
                              value={
                                item.valor_unitario?.toString().replace(".", ",") ||
                                "0,00"
                              }
                              onChange={(e) =>
                                atualizarItem(
                                  index,
                                  "valor_unitario",
                                  e.target.value
                                )
                              }
                              className="w-24 border rounded px-1 py-1 text-right text-sm"
                            />
                          </td>

                          <td className="border p-2 text-right text-blue-700 font-medium">
                            {Number(item.valor_total || 0).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          </td>

                          <td className="border p-2 text-center">
                            <button
                              onClick={() => removerItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-gray-500 italic py-3"
                        >
                          Nenhum produto adicionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <span className="text-sm font-semibold text-gray-700">
                Valor Total:{" "}
                <span className="text-blue-700">
                  {valorTotalPedido.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </span>
            </div>
          </div>

          {/* Rodapé */}
          <div className="border-t p-3 flex justify-end gap-2 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm"
            >
              Salvar Pedido
            </button>
          </div>
        </div>
      </div>

      {/* Modal de seleção de produtos */}
      {mostrarSelecaoProduto && (
        <SelecionarProdutoModal
          isOpen={mostrarSelecaoProduto}
          onClose={() => setMostrarSelecaoProduto(false)}
          onSelect={adicionarProduto}
        />
      )}
    </>
  );
};

export default PedidoModal;
