import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
