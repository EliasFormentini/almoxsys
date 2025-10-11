// import React, { useEffect, useState } from "react";
// import CategoriaForm from "../components/CategoriaForm";
// import CategoriaList from "../components/CategoriaList";
// import { listarCategorias, deletarCategoria } from "../services/categoriaService";

// const CategoriasPage = () => {
//   const [categorias, setCategorias] = useState([]);
//   const [filtro, setFiltro] = useState("");
//   const [mostrarModal, setMostrarModal] = useState(false);
//   const [categoriaEditando, setCategoriaEditando] = useState(null);

//   const carregarCategorias = async () => {
//     try {
//       const data = await listarCategorias();
//       setCategorias(data);
//     } catch (error) {
//       console.error("Erro ao listar categorias:", error);
//     }
//   };

//   useEffect(() => {
//     carregarCategorias();
//   }, []);

//   const categoriasFiltradas = (() => {
//     const termo = filtro.toString().trim().toLowerCase();
//     if (!termo) return categorias;

//     return categorias.filter((cat) => {
//       const id = cat?.id ? String(cat.id) : "";
//       const nome = cat?.nome ? String(cat.nome).toLowerCase() : "";
//       const descricao = cat?.descricao ? String(cat.descricao).toLowerCase() : "";
//       return id.includes(termo) || nome.includes(termo) || descricao.includes(termo);
//     });
//   })();

//   const handleEditar = (categoria) => {
//     setCategoriaEditando(categoria);
//     setMostrarModal(true);
//   };

//   const handleNovo = () => {
//     setCategoriaEditando(null);
//     setMostrarModal(true);
//   };

//   const handleFecharModal = () => {
//     setMostrarModal(false);
//     setCategoriaEditando(null);
//   };

//   const handleAtualizarLista = () => {
//     carregarCategorias();
//     handleFecharModal();
//   };

//   return (
//     <div className="container">
//       <h2>Categorias</h2>

//       <div style={{ marginBottom: "10px" }}>
//         <input
//           type="text"
//           placeholder="Filtrar por código ou descrição..."
//           value={filtro}
//           onChange={(e) => setFiltro(e.target.value)}
//           style={{ marginRight: "10px", padding: "5px" }}
//         />
//         <button onClick={handleNovo}>Novo</button>
//       </div>

//       <CategoriaList
//         categorias={categoriasFiltradas}
//         onEdit={handleEditar}
//         onAtualizar={handleAtualizarLista}
//         onDelete={deletarCategoria}
//       />

//       {mostrarModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalStyle}>
//             <h3>{categoriaEditando ? "Editar Categoria" : "Nova Categoria"}</h3>
//             <CategoriaForm
//               categoria={categoriaEditando}
//               onCancel={handleFecharModal}
//               onSuccess={handleAtualizarLista}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   background: "#fff",
//   padding: "20px",
//   borderRadius: "8px",
//   width: "400px",
//   boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
// };

// export default CategoriasPage;


import { useState, useEffect } from "react";
import categoriaService from "../services/categoriaService";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await categoriaService.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir esta categoria?")) {
      await categoriaService.remove(id);
      carregarCategorias();
    }
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    c.id.toString().includes(filtro)
  );

  return (
    <div className="p-6">
      {/* ===== Título Dinâmico ===== */}
      <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2 text-gray-800">
        Categorias
      </h1>

      {/* ===== Filtro e Botão Novo ===== */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Filtrar por código ou descrição"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-2 w-72 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
          Novo
        </button>
      </div>

      {/* ===== Tabela ===== */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b text-gray-800">
            <tr>
              <th className="px-4 py-2 font-semibold w-24 text-center">Código</th>
              <th className="px-4 py-2 font-semibold">Descrição</th>
              <th className="px-4 py-2 font-semibold text-center w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <tr
                  key={categoria.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-center">{categoria.id}</td>
                  <td className="px-4 py-2">{categoria.descricao}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs mr-2 transition">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-4 italic"
                >
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
