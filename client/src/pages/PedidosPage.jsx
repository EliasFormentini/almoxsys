import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
    listarPedidos,
    criarPedido,
    atualizarPedido,
    excluirPedido,
    atualizarStatusPedido,
} from "../services/pedidoService";
import { baixarRelatorioPedido } from "../services/relatorioService";
import PedidoModal from "../components/PedidoModal";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../contexts/ToastContext";
import { Pencil, Trash2, FileCheck, Printer } from "lucide-react";


const PedidosPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [pedidoEditando, setPedidoEditando] = useState(null);

    const { alert, confirm, AlertComponent } = useAlert();
    const { showToast } = useToast();

    const carregarPedidos = async () => {
        try {
            const response = await listarPedidos();
            setPedidos(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            showToast({
                type: "error",
                title: "Erro ao carregar",
                message: "Não foi possível carregar os pedidos.",
            });
        }
    };

    useEffect(() => {
        carregarPedidos();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleNovoPedido = () => {
        setPedidoEditando(null);
        setMostrarModal(true);
    };

    const handleEditarPedido = (pedido, e) => {
        e.stopPropagation();
        setPedidoEditando(pedido);
        setMostrarModal(true);
    };

    const handleExcluirPedido = async (pedido, e) => {
        e.stopPropagation();

        const confirmado = await confirm({
            title: "Excluir pedido",
            message: `Tem certeza que deseja excluir o pedido nº ${pedido.id}?`,
            type: "warning",
        });

        if (!confirmado) return;

        try {
            await excluirPedido(pedido.id);
            await carregarPedidos();

            showToast({
                type: "success",
                title: "Pedido excluído",
                message: `Pedido nº ${pedido.id} excluído com sucesso.`,
            });
        } catch (err) {
            console.error("Erro ao excluir pedido:", err);
            await alert({
                title: "Erro ao excluir",
                message:
                    err.response?.data?.error ||
                    "Não foi possível excluir o pedido.",
                type: "error",
            });
        }
    };

    const handleAtenderPedido = async (pedido, e) => {
        e.stopPropagation();

        const confirmado = await confirm({
            title: "Atender pedido",
            message: `Confirmar atendimento do pedido nº ${pedido.id}?`,
            type: "warning",
        });

        if (!confirmado) return;

        try {
            await atualizarStatusPedido(pedido.id, "atendido");
            await carregarPedidos();

            showToast({
                type: "success",
                title: "Pedido atendido",
                message: `Pedido nº ${pedido.id} marcado como atendido.`,
            });
        } catch (err) {
            console.error("Erro ao atender pedido:", err);
            await alert({
                title: "Erro ao atender",
                message:
                    err.response?.data?.error ||
                    "Não foi possível atualizar o status do pedido.",
                type: "error",
            });
        }
    };

    const handleBaixarPdf = async (pedido, e) => {
        e.stopPropagation();
        try {
            await baixarRelatorioPedido(pedido.id);
        } catch (err) {
            console.error("Erro ao baixar PDF do pedido:", err);
            showToast({
                type: "error",
                title: "Erro no PDF",
                message: "Não foi possível gerar o PDF do pedido.",
            });
        }
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Pedidos de Compra
                    </h1>

                    <div className="flex items-center gap-2">
                        <button
                            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
                            onClick={handleNovoPedido}
                        >
                            Novo Pedido
                        </button>
                    </div>
                </div>

                {mostrarModal && (
                    <PedidoModal
                        isOpen={mostrarModal}
                        onClose={() => {
                            setMostrarModal(false);
                            setPedidoEditando(null);
                        }}
                        pedidoInicial={pedidoEditando}
                        onSave={async (dadosPedido) => {
                            try {
                                if (pedidoEditando) {
                                    // edição
                                    await atualizarPedido(pedidoEditando.id, dadosPedido);

                                    showToast({
                                        type: "success",
                                        title: "Pedido atualizado",
                                        message: "O pedido foi atualizado com sucesso!",
                                    });
                                } else {
                                    // criação
                                    const res = await criarPedido(dadosPedido);
                                    const pedidoCriado = res.data;

                                    showToast({
                                        type: "success",
                                        title: "Pedido criado",
                                        message: "O pedido foi registrado com sucesso!",
                                    });

                                    try {
                                        await baixarRelatorioPedido(pedidoCriado.id);
                                    } catch (errPdf) {
                                        console.error("Erro ao gerar PDF do pedido:", errPdf);
                                        showToast({
                                            type: "error",
                                            title: "Erro no PDF",
                                            message:
                                                "O pedido foi criado, mas houve erro ao gerar o PDF.",
                                        });
                                    }
                                }

                                await carregarPedidos();
                                setMostrarModal(false);
                                setPedidoEditando(null);
                            } catch (err) {
                                console.error("Erro ao salvar pedido:", err);

                                await alert({
                                    title: pedidoEditando
                                        ? "Erro ao atualizar pedido"
                                        : "Erro ao salvar pedido",
                                    message:
                                        err.response?.data?.error ||
                                        "Não foi possível salvar o pedido.",
                                    type: "error",
                                });
                            }
                        }}
                    />
                )}

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="px-4 py-3 border-b text-left">Nº Pedido</th>
                                <th className="px-4 py-3 border-b text-left">Tipo</th>
                                <th className="px-4 py-3 border-b text-left">Data</th>
                                <th className="px-4 py-3 border-b text-left">Status</th>
                                <th className="px-4 py-3 border-b text-right">Valor Total</th>
                                <th className="px-4 py-3 border-b text-center w-56">
                                    Ações
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.length > 0 ? (
                                pedidos.map((pedido) => {
                                    const itens = pedido.itens || pedido.ItemPedidos || [];
                                    const valorTotal =
                                        pedido.valor_total ??
                                        itens.reduce(
                                            (acc, item) => acc + Number(item.valor_total || 0),
                                            0
                                        );

                                    const isPendente = pedido.status === "pendente";

                                    return (
                                        <React.Fragment key={pedido.id}>
                                            <tr
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => toggleExpand(pedido.id)}
                                            >
                                                <td className="px-4 py-2 border-b">{pedido.id}</td>
                                                <td className="px-4 py-2 border-b capitalize">
                                                    {pedido.tipo}
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    {pedido.data_pedido
                                                        ? new Date(
                                                            pedido.data_pedido
                                                        ).toLocaleDateString("pt-BR")
                                                        : "—"}
                                                </td>
                                                <td className="px-4 py-2 border-b capitalize">
                                                    {pedido.status}
                                                </td>
                                                <td className="px-4 py-2 border-b text-right font-semibold">
                                                    {Number(valorTotal || 0).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </td>
                                                <td className="px-4 py-2 border-b text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleExpand(pedido.id);
                                                            }}
                                                            className="text-gray-600 hover:text-gray-800"
                                                            title="Ver itens"
                                                        >
                                                            {expandedId === pedido.id ? (
                                                                <FaChevronUp />
                                                            ) : (
                                                                <FaChevronDown />
                                                            )}
                                                        </button>

                                                        {isPendente && (
                                                            <button
                                                                onClick={(e) =>
                                                                    handleEditarPedido(pedido, e)
                                                                }
                                                                className="text-sm px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                        )}

                                                        {isPendente && (
                                                            <button
                                                                onClick={(e) =>
                                                                    handleExcluirPedido(pedido, e)
                                                                }
                                                                className="text-sm px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={(e) => handleAtenderPedido(pedido, e)}
                                                            disabled={!isPendente}
                                                            className={`text-sm px-2 py-1 rounded text-white flex items-center justify-center gap-1 ${isPendente
                                                                    ? "bg-green-600 hover:bg-green-700"
                                                                    : "bg-gray-400 cursor-not-allowed opacity-60"
                                                                }`}
                                                            title={isPendente ? "Atender pedido" : "Pedido já atendido"}
                                                        >
                                                            <FileCheck size={16} />
                                                        </button>

                                                        <button
                                                            onClick={(e) => handleBaixarPdf(pedido, e)}
                                                            className="text-sm px-2 py-1 rounded border border-blue-700 text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <Printer size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Linha expandida com itens */}
                                            {expandedId === pedido.id && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan="6" className="p-0">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">
                                                                        Produto
                                                                    </th>
                                                                    <th className="px-4 py-2 text-center">
                                                                        Qtd
                                                                    </th>
                                                                    <th className="px-4 py-2 text-right">
                                                                        Vlr Unit
                                                                    </th>
                                                                    <th className="px-4 py-2 text-right">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {itens.length > 0 ? (
                                                                    itens.map((item) => (
                                                                        <tr key={item.id} className="border-t">
                                                                            <td className="px-4 py-2 border-b">
                                                                                {item.produto?.nome ||
                                                                                    item.Produto?.nome ||
                                                                                    "—"}
                                                                            </td>
                                                                            <td className="px-4 py-2 border-b text-center">
                                                                                {item.quantidade}
                                                                            </td>
                                                                            <td className="px-4 py-2 border-b text-right">
                                                                                {Number(
                                                                                    item.valor_unitario || 0
                                                                                ).toLocaleString("pt-BR", {
                                                                                    style: "currency",
                                                                                    currency: "BRL",
                                                                                })}
                                                                            </td>
                                                                            <td className="px-4 py-2 border-b text-right text-blue-700 font-medium">
                                                                                {Number(
                                                                                    item.valor_total || 0
                                                                                ).toLocaleString("pt-BR", {
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
                                                                            Nenhum item vinculado.
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
                                        Nenhum pedido encontrado.
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

export default PedidosPage;
