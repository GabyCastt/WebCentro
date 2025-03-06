import React from 'react';
import './Header.css';
import headerImage from './header-image.jpg';

const Header = () => {
  return (
    <header className="header">
      <img src={headerImage} alt="Header" className="header-image" />
    </header>
  );
};

export default Header;