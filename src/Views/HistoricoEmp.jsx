import React, { useState } from 'react';
import './HistoricoEmp.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

function HistoricoEmp() {
  const [searchTerm, setSearchTerm] = useState('');

  // Ejemplo de dato en la tabla
  const emprendedores = [
    { id: 1, fecha: '04/05/2024', nombre: 'GABRIELA CASTILLO' },
    { id: 2, fecha: '04/05/2024', nombre: 'JUAN PEREZ' },
    { id: 3, fecha: '04/05/2024', nombre: 'MARIA RODRIGUEZ' },
    { id: 4, fecha: '04/05/2024', nombre: 'CARLOS GONZALEZ' },
    { id: 5, fecha: '04/05/2024', nombre: 'JUAN PEREZ' },
    { id: 6, fecha: '04/05/2024', nombre: 'MARIA RODRIGUEZ' },
    { id: 7, fecha: '04/05/2024', nombre: 'CARLOS GONZALEZ' },
    { id: 8, fecha: '04/05/2024', nombre: 'JUAN PEREZ' },
    { id: 9, fecha: '04/05/2024', nombre: 'MARIA RODRIGUEZ' },
    { id: 10, fecha: '04/05/2024', nombre: 'CARLOS GONZALEZ' },
  ];

  // Filtrar emprendedores según el término de búsqueda
  const filteredEmprendedores = emprendedores.filter((emprendedor) =>
    emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funciones para manejar los clics de los botones
  const handleButton1Click = () => {
    alert('Botón 1 clickeado');
  };

  const handleButton2Click = () => {
    alert('Botón 2 clickeado');
  };

  // Funciones para los botones de la tabla
  const handleEditClick = (id) => {
    alert(`Editar emprendedor con ID: ${id}`);
  };
  
  const handleDetailsClick = (id) => {
    alert(`Detalles del emprendedor con ID: ${id}`);
  };
  
  const handleDeleteClick = (id) => {
    alert(`Eliminar emprendedor con ID: ${id}`);
  };
  

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <main>
        <h1>HISTÓRICO EMPRENDEDORES</h1>

        {/* Apartado de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Estructura de la tabla */}
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre Emprendedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmprendedores.map((emprendedor) => (
              <tr key={emprendedor.id}>
                <td>{emprendedor.fecha}</td>
                <td>{emprendedor.nombre}</td>
                <td>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => handleDetailsClick(emprendedor.id)}
                  >
                    Detalles
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteClick(emprendedor.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones adicionales debajo de la tabla */}
        <div className="button-container">
          <button onClick={handleButton1Click}>Reporte General</button>
          <button onClick={handleButton2Click}>Añadir Emprendedor</button>
        </div>
      </main>
    </div>
  );
}

export default HistoricoEmp;