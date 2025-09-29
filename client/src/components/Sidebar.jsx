import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      style={{
        width: "200px",
        height: "100vh",
        background: "#222",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2>AlmoxSys</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/categorias" style={{ color: "#fff", textDecoration: "none" }}>
              Categorias
            </Link>
          </li>
          <li>
            <Link to="/produtos" style={{ color: "#fff", textDecoration: "none" }}>
              Produtos
            </Link>
          </li>
          <li>
            <Link to="/unidades" style={{ color: "#fff", textDecoration: "none" }}>
              Unidades
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
