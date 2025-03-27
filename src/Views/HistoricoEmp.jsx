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
    window.scrollTo(0, 0);
  }, []);
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
    emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emprendedor.correo && emprendedor.correo.toLowerCase().includes(searchTerm.toLowerCase()))
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
    <div className="historico-container">
      <Header />
      <Sidebar />
      <main className="historico-main-content">
        <h1 className="historico-title">HISTÓRICO EMPRENDEDORES</h1>
        <input
          type="text"
          className="historico-search-input"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="historico-table">
          <thead className="historico-table-header">
            <tr>
              <th>#</th>
              <th>Nombre Emprendedor</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmprendedores.length > 0 ? (
              filteredEmprendedores.map((emprendedor) => (
                <tr key={emprendedor.idEmprendedor} className="historico-table-row">
                  <td className="historico-table-cell">{emprendedor.fecha}</td>
                  <td className="historico-table-cell">{emprendedor.nombre}</td>
                  <td className="historico-table-cell">{emprendedor.correo || 'No registrado'}</td>
                  <td className="historico-table-cell">
                    <button
                      className="historico-action-btn historico-details-btn"
                      onClick={() => handleDetailsClick(emprendedor.idEmprendedor)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="historico-no-data">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="historico-actions-container">
          <button className="historico-primary-btn historico-report-btn" onClick={handleButton1Click}>Reporte General</button>
          <button className="historico-primary-btn historico-add-btn" onClick={handleButton2Click}>Añadir Emprendedor</button>
        </div>
      </main>
    </div>
  );
}

export default HistoricoEmp;