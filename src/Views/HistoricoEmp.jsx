import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HistoricoEmp.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

function HistoricoEmp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmprendedores = async () => {
      try {
        const response = await axios.get('https://localhost:7075/api/Emprendedores');
        setEmprendedores(response.data);
      } catch (error) {
        console.warn("No se pudo obtener los datos del backend.");
        setEmprendedores([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendedores();
  }, []);

  const filteredEmprendedores = emprendedores.filter((emprendedor) =>
    emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailsClick = (idEmprendedor) => {
    console.log("ID del emprendedor en HistoricoEmp:", idEmprendedor);
    navigate(`/detalles/${idEmprendedor}`);
  };

  const handleDeleteClick = async (idEmprendedor) => {
    try {
      await axios.delete(`https://localhost:7075/api/Emprendedores/${idEmprendedor}`);
      setEmprendedores((prevEmprendedores) =>
        prevEmprendedores.filter((emprendedor) => emprendedor.idEmprendedor !== idEmprendedor)
      );
      alert("Emprendedor eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el emprendedor:", error.response || error);
      alert("Error al eliminar el emprendedor");
    }
  };

  const handleButton1Click = () => {
    alert('Reporte General generado');
  };

  const handleButton2Click = () => {
    navigate("/registroemp"); 
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
            {filteredEmprendedores.length > 0 ? (
              filteredEmprendedores.map((emprendedor) => (
                <tr key={emprendedor.idEmprendedor}>
                  <td>{emprendedor.fecha}</td>
                  <td>{emprendedor.nombre}</td>
                  <td>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => handleDetailsClick(emprendedor.idEmprendedor)}
                    >
                      Detalles
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteClick(emprendedor.idEmprendedor)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="button-container">
          <button onClick={handleButton1Click}>Reporte General</button>
          <button onClick={handleButton2Click}>Añadir Emprendedor</button>
        </div>
      </main>
    </div>
  );
}

export default HistoricoEmp;
