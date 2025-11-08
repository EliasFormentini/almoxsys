import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarInventarios, abrirInventario } from "../services/inventarioService";

const InventarioPage = () => {
    const [inventarios, setInventarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const carregar = async () => {
        try {
            const { data } = await listarInventarios();
            // aqui usamos diretamente o que o backend retorna (InventarioProduto)
            setInventarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar inventários:", err);
            setInventarios([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const handleAbrirInventario = async () => {
        try {
            const { data } = await abrirInventario();
            navigate(`/inventario/${data.id}`);
        } catch (err) {
            console.error("Erro ao abrir inventário:", err.response?.data || err);

            const msg = err.response?.data?.error;
            const inventarioId = err.response?.data?.inventario_id;

            if (msg === "Já existe um inventário em aberto." && inventarioId) {
                if (confirm("Já existe um inventário em aberto. Deseja ir para ele?")) {
                    navigate(`/inventario/${inventarioId}`);
                }
            } else {
                alert(
                    msg || "Erro ao abrir inventário. Veja o console para detalhes."
                );
            }
        }
    };

    const formatSituacao = (registro) =>
        registro.inventario_concluido ? "Concluído" : "Ativo";

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h1 className="text-2xl font-semibold text-gray-800">Inventário</h1>
                <button
                    className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
                    onClick={handleAbrirInventario}
                >
                    Abrir inventário
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 text-sm">
                        <tr>
                            <th className="px-4 py-3 border-b text-left">ID</th>
                            <th className="px-4 py-3 border-b text-left">Data</th>
                            <th className="px-4 py-3 border-b text-left">Situação</th>
                            <th className="px-4 py-3 border-b text-center w-32">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : inventarios.length ? (
                            inventarios.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{inv.id}</td>
                                    <td className="px-4 py-2 border-b">
                                        {inv.data_abertura
                                            ? new Date(inv.data_abertura).toLocaleDateString("pt-BR")
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${inv.inventario_concluido
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {formatSituacao(inv)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b text-center">
                                        <button
                                            className="text-blue-700 hover:underline text-sm"
                                            onClick={() => navigate(`/inventario/${inv.id}`)}
                                        >
                                            Abrir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-4 py-4 text-center text-gray-500 italic"
                                >
                                    Nenhum inventário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventarioPage;
