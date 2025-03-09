import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Sidebar.css';
import menuBackground from './side2.jpg';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleHistoricoClick = () => {
    navigate('/historico'); // Redirige a la ruta /historico
  };

  return (
    <>
      {/* Botón de toggle siempre visible */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Menú que se abre/cierra */}
      <nav className={`menu ${isOpen ? 'open' : ''}`} style={{ backgroundImage: `url(${menuBackground})` }}>
        <button className="menu-button" onClick={handleHistoricoClick}>HISTÓRICO EMPRENDEDORES</button>
        <button className="menu-button">NUEVO REGISTRO EMPRENDEDOR</button>
        <button className="menu-button">ENCUESTA</button>
      </nav>
    </>
  );
};

export default Menu;