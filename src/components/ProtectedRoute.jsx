import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { usuario } = useAuth();

  const esStaff =
    usuario &&
    ["Administrador", "Vendedor"].includes(usuario.tipo);

  if (!esStaff) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;