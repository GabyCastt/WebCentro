import React from 'react';
import './Sidebar.css';
import menuBackground from './sidebar_background.jpg';

const Menu = () => {
  return (
    <nav className="menu" style={{ backgroundImage: `url(${menuBackground})` }}>
      <button className="menu-button">HISTORIAL DE REGISTROS</button>
      <button className="menu-button">NUEVO REGISTRO</button>
      <button className="menu-button">ENCUESTA</button>
    </nav>
  );
};

export default Menu;