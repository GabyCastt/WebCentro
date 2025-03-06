import React from 'react';
import './Sidebar.css';
import menuBackground from './sidebar-background.jpg';

const Menu = () => {
  return (
    <nav className="menu" style={{ backgroundImage: `url(${menuBackground})` }}>
      <button className="menu-button">Inicio</button>
      <button className="menu-button">Servicios</button>
      <button className="menu-button">Contacto</button>
    </nav>
  );
};

export default Menu;