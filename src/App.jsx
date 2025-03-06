import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Menu from './components/Side-bar/Sidebar';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <Header />

      {/* Menu */}
      <Menu />

      {/* Contenido principal */}
      <main>
        <h1>Bienvenido a mi aplicación</h1>
        <p>Este es el contenido principal de la aplicación.</p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;