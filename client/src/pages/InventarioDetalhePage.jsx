import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getInventarioById,
    concluirInventario,
} from "../services/inventarioService";
import { listarProdutos } from "../services/produtoService";
import SelecionarProdutoModal from "../components/SelecionarProdutoModal";
import AdicionarProdutoModal from "../components/AdicionarProdutoModal";


const InventarioDetalhePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inventario, setInventario] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [contagens, setContagens] = useState({});
    const [loading, setLoading] = useState(true);
    const isConcluido = inventario?.inventario_concluido;


    const [mostrarSelecaoProduto, setMostrarSelecaoProduto] = useState(false);
    const [produtoParaAdicionar, setProdutoParaAdicionar] = useState(null);
    const [mostrarAdicionarProduto, setMostrarAdicionarProduto] = useState(false);


    useEffect(() => {
        const carregar = async () => {
            try {
                const [{ data: inv }, { data: listaProdutos }] = await Promise.all([
                    getInventarioById(id),
                    listarProdutos(),
                ]);

                setInventario(inv);

                // produtos com estoque > 0
                const ativos = (listaProdutos || []).filter(
                    (p) => (p.estoque_atual || 0) > 0
                );

                setProdutos(ativos);

                // se no futuro o backend devolver contagens vinculadas, podemos preencher aqui
                const mapa = {};
                setContagens(mapa);
            } catch (err) {
                console.error("Erro ao carregar inventário:", err);
            } finally {
                setLoading(false);
            }
        };

        carregar();
    }, [id]);

    const handleChangeContagem = (produtoId, value) => {
        setContagens((prev) => ({
            ...prev,
            [produtoId]: value,
        }));
    };

    const handleSalvarEConcluir = async () => {
        try {
            if (!inventario) {
                alert("Inventário não encontrado.");
                return;
            }

            const produtosComContagem = Object.entries(contagens)
                .map(([id_produto, valor]) => ({
                    id_produto: Number(id_produto),
                    qtd_correta: Number(valor),
                }))
                .filter(
                    (item) =>
                        item.id_produto > 0 &&
                        !isNaN(item.qtd_correta) &&
                        item.qtd_correta >= 0
                );

            if (!produtosComContagem.length) {
                alert("Informe pelo menos uma quantidade para salvar.");
                return;
            }

            await concluirInventario(inventario.id, produtosComContagem);

            alert("Inventário concluído e estoques ajustados.");
            navigate("/inventario");
        } catch (err) {
            console.error("Erro ao concluir inventário:", err.response?.data || err);
            alert(
                err.response?.data?.error ||
                "Erro ao concluir inventário. Veja o console para detalhes."
            );
        }
    };


    // Selecionar produto extra (fora dos com estoque > 0)
    const handleSelectProduto = (produto) => {
        setProdutoParaAdicionar(produto);
        setMostrarAdicionarProduto(true);
        setMostrarSelecaoProduto(false);
    };

    const confirmarAdicionarProduto = (itemComQtd) => {
        // adiciona na lista visual e permite contagem
        setProdutos((prev) => {
            const existe = prev.find((p) => p.id === itemComQtd.id);
            if (existe) return prev;
            return [...prev, itemComQtd];
        });

        setContagens((prev) => ({
            ...prev,
            [itemComQtd.id]: itemComQtd.quantidade ?? "",
        }));

        setProdutoParaAdicionar(null);
        setMostrarAdicionarProduto(false);
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!inventario) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <p className="text-red-600">Inventário não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Inventário #{inventario.id}
                    </h1>
                      <p className="text-sm text-gray-600">
    Situação:{" "}
    {inventario?.inventario_concluido ? (
      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
        Concluído
      </span>
    ) : (
      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Ativo
      </span>
    )}
  </p>
                    <p className="text-sm text-gray-600">
                        Abertura:{" "}
                        {inventario.data_abertura
                            ? new Date(inventario.data_abertura).toLocaleDateString("pt-BR")
                            : "--/--/----"}
                    </p>
                </div>

                <div className="flex gap-2">
                    {!isConcluido && (
                        <button
                            onClick={() => setMostrarSelecaoProduto(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                            + Adicionar produto
                        </button>
                    )}
                    {!isConcluido && (
                        <button
                            onClick={handleSalvarEConcluir}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                            Salvar contagem e concluir
                        </button>
                    )}
                </div>
            </div>

            {/* Tabela de produtos */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Produto</th>
                            <th className="px-4 py-2 border-b text-right">
                                Estoque atual
                            </th>
                            <th className="px-4 py-2 border-b text-right">
                                Contagem (novo estoque)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.length ? (
                            produtos.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">
                                        {p.nome || `Produto ${p.id}`}
                                    </td>
                                    <td className="px-4 py-2 border-b text-right">
                                        {p.estoque_atual ?? 0}
                                    </td>
                                    <td className="px-4 py-2 border-b text-right">
                                        <input
                                            type="number"
                                            min="0"
                                            value={contagens[p.id] ?? ""}
                                            onChange={(e) =>
                                                !isConcluido && handleChangeContagem(p.id, e.target.value)
                                            }
                                            disabled={isConcluido}
                                            className={`w-32 border rounded-md px-2 py-1 text-right ${isConcluido ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                                }`}
                                            placeholder="Qtd"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="px-4 py-4 text-center text-gray-500 italic"
                                >
                                    Nenhum produto com estoque para este inventário.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modais */}
            <SelecionarProdutoModal
                isOpen={mostrarSelecaoProduto}
                onClose={() => setMostrarSelecaoProduto(false)}
                onSelect={handleSelectProduto}
            />

            <AdicionarProdutoModal
                isOpen={mostrarAdicionarProduto}
                produto={produtoParaAdicionar}
                modo="inventario"
                onConfirm={confirmarAdicionarProduto}
                onClose={() => {
                    setMostrarAdicionarProduto(false);
                    setProdutoParaAdicionar(null);
                }}
            />
        </div>
    );
};

export default InventarioDetalhePage;
