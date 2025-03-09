import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HistoricoEmp.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

function HistoricoEmp() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const emprendedores = [
    { id: 1, fecha: '04/05/2024', nombre: 'GABRIELA CASTILLO' },
    { id: 2, fecha: '04/05/2024', nombre: 'JUAN PEREZ' },
    { id: 3, fecha: '04/05/2024', nombre: 'MARIA RODRIGUEZ' },
    { id: 4, fecha: '04/05/2024', nombre: 'CARLOS GONZALEZ' },
  ];

  const filteredEmprendedores = emprendedores.filter((emprendedor) =>
    emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailsClick = (id) => {
    navigate(`/detalles/${id}`);
  };

  const handleButton1Click = () => {
    alert('Reporte General generado');
  };

  const handleButton2Click = () => {
    alert('Añadir nuevo emprendedor');
  };

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <main>
        <h1>HISTÓRICO EMPRENDEDORES</h1>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
                  <button className="btn btn-outline-danger">
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
