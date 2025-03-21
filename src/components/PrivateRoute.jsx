import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ user }) => {
  const navigate = useNavigate();

  // Si no hay un usuario autenticado, redirige al login
  if (!user) {
    navigate("/login");
    return null;
  }

  return <Outlet />; // Renderiza las rutas hijas si el usuario está autenticado
};

export default PrivateRoute;
