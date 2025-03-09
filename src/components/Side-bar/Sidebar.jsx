import React, { useState } from 'react';
import './Sidebar.css';
import menuBackground from './side2.jpg';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón de toggle siempre visible */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Menú que se abre/cierra */}
      <nav className={`menu ${isOpen ? 'open' : ''}`} style={{ backgroundImage: `url(${menuBackground})` }}>
        <button className="menu-button">HISTÓRICO EMPRENDEDORES</button>
        <button className="menu-button">NUEVO REGISTRO EMPRENDEDOR</button>
        <button className="menu-button">ENCUESTA</button>
      </nav>
    </>
  );
};

export default Menu;