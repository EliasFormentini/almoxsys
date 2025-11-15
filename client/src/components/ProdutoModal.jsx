import React, { useEffect, useState } from "react";
import * as categoriaService from "../services/categoriaService";
import * as unidadeService from "../services/unidadeService";
import * as produtoService from "../services/produtoService";
import { useAlert } from "../hooks/useAlert";

const ProdutoModal = ({ isOpen, onClose, onSave, produtoSelecionado }) => {
  const [nome, setNome] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [idUnidade, setIdUnidade] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState(0);
  const [estoqueMinimo, setEstoqueMinimo] = useState(0);
  const [status, setStatus] = useState("A");
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const { alert, AlertComponent } = useAlert();

  useEffect(() => {
    carregarListas();
  }, []);

  useEffect(() => {
    if (produtoSelecionado) {
      setNome(produtoSelecionado.nome || "");
      setIdCategoria(produtoSelecionado.id_categoria || "");
      setIdUnidade(produtoSelecionado.id_unidade || "");
      setEstoqueAtual(produtoSelecionado.estoque_atual || 0);
      setEstoqueMinimo(produtoSelecionado.estoque_minimo || 0);
      setStatus(produtoSelecionado.status || "A");
    } else {
      setNome("");
      setIdCategoria("");
      setIdUnidade("");
      setEstoqueAtual(0);
      setEstoqueMinimo(0);
      setStatus("A");
    }
  }, [produtoSelecionado, isOpen]);

  const carregarListas = async () => {
    try {
      const [catRes, unRes] = await Promise.all([
        categoriaService.listar(),
        unidadeService.listar(),
      ]);
      setCategorias(catRes.data);
      setUnidades(unRes.data);
    } catch (err) {
      console.error("Erro ao carregar categorias/unidades:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      await alert({
        title: "Nome obrigatório",
        message: "Informe o nome do produto.",
        type: "warning",
      });
      return;
    }

    onSave({
      id: produtoSelecionado ? produtoSelecionado.id : null,
      nome,
      id_categoria: idCategoria,
      id_unidade: idUnidade,
      estoque_atual: estoqueAtual,
      estoque_minimo: estoqueMinimo,
      status,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {produtoSelecionado ? "Editar Produto" : "Novo Produto"}
            </h2>
            <button onClick={onClose} className="text-white text-xl" type="button">
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Digite o nome do produto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecione</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unidade</label>
                <select
                  value={idUnidade}
                  onChange={(e) => setIdUnidade(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecione</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.sigla} - {u.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Estoq. Atual
                </label>
                <input
                  type="number"
                  value={estoqueAtual}
                  onChange={(e) => setEstoqueAtual(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Estoq. Mínimo
                </label>
                <input
                  type="number"
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {produtoSelecionado ? "Salvar Alterações" : "Criar Produto"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {AlertComponent}
    </>
  );
};

export default ProdutoModal;
