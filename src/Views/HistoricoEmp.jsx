import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HistoricoEmp.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";

function HistoricoEmp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEmprendedores();
  }, []);

  const fetchEmprendedores = async () => {
    try {
      const response = await axios.get("https://localhost:7075/api/Emprendedores");
      setEmprendedores(response.data);
    } catch (error) {
      console.error("Error cargando emprendedores:", error);
      alert("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleInactivar = async (idEmprendedor) => {
    try {
      await axios.delete(`https://localhost:7075/api/Emprendedores/${idEmprendedor}`);
      
      setEmprendedores(prev => prev.map(emp => 
        emp.idEmprendedor === idEmprendedor 
          ? { ...emp, estado: false, fechaInactivacion: new Date().toISOString() } 
          : emp
      ));
      
      alert("Emprendedor inactivado correctamente");
    } catch (error) {
      console.error("Error inactivando:", error);
      alert("Error al inactivar");
    }
  };

  const handleActivar = async (idEmprendedor) => {
    try {
      await axios.put(`https://localhost:7075/api/Emprendedores/activate/${idEmprendedor}`);
      
      setEmprendedores(prev => prev.map(emp => 
        emp.idEmprendedor === idEmprendedor 
          ? { ...emp, estado: true, fechaInactivacion: null } 
          : emp
      ));
      
      alert("Emprendedor reactivado correctamente");
    } catch (error) {
      console.error("Error reactivando:", error);
      alert("Error al reactivar");
    }
  };

  const handleDetailsClick = (emprendedor) => {
    if (!emprendedor.estado) {
      alert("No se puede acceder a los detalles de un emprendedor inactivo");
      return;
    }
    navigate(`/detalles/${emprendedor.idEmprendedor}`);
  };

  const filteredEmprendedores = emprendedores.filter(
    (emprendedor) =>
      emprendedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emprendedor.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFecha = (fecha) => {
    if (!fecha) return "Activo";
    const date = new Date(fecha);
    return `Inactivo desde ${date.toLocaleDateString('es-ES')}`;
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
        
        <div className="historico-actions-container">
          <button
            className="historico-primary-btn historico-add-btn"
            onClick={() => navigate("/registroemp")}
          >
            Añadir Emprendedor
          </button>
        </div>

        {loading ? (
          <div className="historico-no-data">Cargando...</div>
        ) : (
          <table className="historico-table">
            <thead className="historico-table-header">
              <tr>
                <th>#</th>
                <th>Nombre Emprendedor</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmprendedores.length > 0 ? (
                filteredEmprendedores.map((emprendedor) => (
                  <tr
                    key={emprendedor.idEmprendedor}
                    className={`historico-table-row ${!emprendedor.estado ? 'inactive-row' : ''}`}
                  >
                    <td className="historico-table-cell">{emprendedor.idEmprendedor}</td>
                    <td className="historico-table-cell">{emprendedor.nombre}</td>
                    <td className="historico-table-cell">
                      {emprendedor.correo || "No registrado"}
                    </td>
                    <td className="historico-table-cell">
                      {emprendedor.estado ? (
                        <span className="status-active">Activo</span>
                      ) : (
                        <span className="status-inactive">
                          {formatFecha(emprendedor.fechaInactivacion)}
                        </span>
                      )}
                    </td>
                    <td className="historico-table-cell historico-actions">
                      <button
                        className={`historico-action-btn historico-details-btn ${!emprendedor.estado ? 'disabled-btn' : ''}`}
                        onClick={() => handleDetailsClick(emprendedor)}
                        disabled={!emprendedor.estado}
                      >
                        Detalles
                      </button>
                      {emprendedor.estado ? (
                        <button
                          className="historico-action-btn historico-deactivate-btn"
                          onClick={() => handleInactivar(emprendedor.idEmprendedor)}
                        >
                          Inactivar
                        </button>
                      ) : (
                        <button
                          className="historico-action-btn historico-activate-btn"
                          onClick={() => handleActivar(emprendedor.idEmprendedor)}
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="historico-no-data">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default HistoricoEmp;