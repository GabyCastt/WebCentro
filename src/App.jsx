import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Menu from './components/Side-bar/Sidebar';
import Footer from './components/Footer/Footer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const emprendedores = [
    { fecha: '04/05/2024', nombre: 'GABRIELA CASTILLO' },
    { fecha: '18/02/2024', nombre: 'MARCELA CALVACHE' },
    { fecha: '09/03/2023', nombre: 'JOSE OROZCO' },
    { fecha: '04/12/2021', nombre: 'ROBERTO SIMBARA' },
  ];

  const filteredEmprendedores = emprendedores.filter(emprendedor =>
    emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funciones para manejar los clics de los botones
  const handleButton1Click = () => {
    alert('Botón 1 clickeado');
  };

  const handleButton2Click = () => {
    alert('Botón 2 clickeado');
  };

  return (
    <div className="App">
      <Header />
      <Menu />
      <main>
        <h1>HISTÓRICO EMPRENDEDORES</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSearchTerm('')}>Limpiar</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>FECHA</th>
                <th>NOMBRE EMPRENDEDOR</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmprendedores.map((emprendedor, index) => (
                <tr key={index}>
                  <td>{emprendedor.fecha}</td>
                  <td>{emprendedor.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones adicionales debajo de la tabla */}
        <div className="button-container">
          <button onClick={handleButton1Click}>Reporte General</button>
          <button onClick={handleButton2Click}>Añadir Emprendedor</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;