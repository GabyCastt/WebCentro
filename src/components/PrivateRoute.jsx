import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]); 

  
  if (!user) {
    return null;  
  }

  return <Outlet />; // Renderiza las rutas hijas si el usuario está autenticado
};

export default PrivateRoute;
