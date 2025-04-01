import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import menuBackground from "./side2.jpg";
import { useAuthContext } from "../../context/AuthContext";

const Menu = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(true);
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // En desktop, forzar que siempre esté abierto
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleInicioClick = () => navigate("/home");
  const handleHistoricoClick = () => navigate("/historico");
  const handleRegistroClick = () => navigate("/registroemp");
  const handleReporteriaClick = () => navigate("/reporteriarol");
  const handleBIClick = () => navigate("/bi");
  const handleIAClick = () => navigate("/ia");
  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* Botón solo visible en móvil */}
      {isMobile && (
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
        <nav
          className="menu"
          style={{ backgroundImage: `url(${menuBackground})` }}
        >
          <div className="menu-buttons-container"> {/* Nuevo contenedor */}
            <button className="menu-button" onClick={handleInicioClick}>
              INICIO
            </button>
            <button className="menu-button" onClick={handleHistoricoClick}>
              HISTÓRICO EMPRENDEDORES
            </button>
            <button className="menu-button" onClick={handleRegistroClick}>
              NUEVO REGISTRO EMPRENDEDOR
            </button>
            <button className="menu-button" onClick={handleReporteriaClick}>
              REPORTERÍA
            </button>
            <button className="menu-button" onClick={handleBIClick}>
              BUSSINESS
            </button>
            <button className="menu-button" onClick={handleIAClick}>
              INTELIGENCIA ARTIFICIAL
            </button>
            <button className="menu-button" onClick={handleLogout}>
              SALIR
            </button>
          </div>
        </nav>
      </div>
      
      {/* Overlay solo en móvil */}
      {isMobile && isOpen && (
        <div className="menu-overlay" onClick={toggleMenu} />
      )}
    </>
  );
};

export default Menu;