// import { useState } from "react";
// import { deletarCategoria } from "../services/categoriaService";

// const CategoriaList = ({ categorias, onEdit, onAtualizar }) => {
//   const [carregando, setCarregando] = useState(false);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

//     try {
//       setCarregando(true);
//       await deletarCategoria(id);
//       alert("Categoria excluída com sucesso!");
//       onAtualizar(); // recarrega lista
//     } catch (err) {
//       console.error("Erro ao excluir categoria:", err.response?.data || err.message);
//       alert("Erro ao excluir categoria!");
//     } finally {
//       setCarregando(false);
//     }
//   };

//   if (!categorias.length) {
//     return <p>Nenhuma categoria encontrada.</p>;
//   }

//   return (
//     <table style={{ width: "100%", borderCollapse: "collapse" }}>
//       <thead>
//         <tr style={{ backgroundColor: "#f0f0f0" }}>
//           <th style={{ border: "1px solid #ccc", padding: "8px" }}>Código</th>
//           <th style={{ border: "1px solid #ccc", padding: "8px" }}>Descrição</th>
//           <th style={{ border: "1px solid #ccc", padding: "8px" }}>Ações</th>
//         </tr>
//       </thead>
//       <tbody>
//         {categorias.map((categoria) => (
//           <tr key={categoria.id}>
//             <td style={{ border: "1px solid #ccc", padding: "8px" }}>{categoria.id}</td>
//             <td style={{ border: "1px solid #ccc", padding: "8px" }}>{categoria.nome}</td>
//             <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//               <button
//                 onClick={() => onEdit(categoria)}
//                 style={{
//                   marginRight: "8px",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   padding: "6px 10px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Editar
//               </button>
//               <button
//                 onClick={() => handleDelete(categoria.id)}
//                 style={{
//                   backgroundColor: "#dc3545",
//                   color: "white",
//                   border: "none",
//                   padding: "6px 10px",
//                   cursor: "pointer",
//                 }}
//                 disabled={carregando}
//               >
//                 {carregando ? "Excluindo..." : "Excluir"}
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default CategoriaList;
