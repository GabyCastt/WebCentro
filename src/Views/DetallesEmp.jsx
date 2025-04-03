import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetallesEmp.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";

function DetallesEmprendedor() {
  const { idEmprendedor } = useParams();
  const navigate = useNavigate();
  const [emprendedor, setEmprendedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmprendedor, setEditedEmprendedor] = useState({
    nombre: "",
    edad: "",
    nivelEstudio: "",
    trabajoRelacionDependencia: false,
    sueldoMensual: "",
    ruc: "",
    empleadosHombres: 0,
    empleadosMujeres: 0,
    rangoEdadEmpleados: "",
    tipoEmpresa: "",
    anoCreacionEmpresa: 0,
    direccion: "",
    telefono: "",
    celular: "",
    correo: "",
    cedula: "",
    datosEmps: [],
  });

  const opcionesRangoEdad = ["18-25", "26-35", "36-45", "46-59", "60+"];
  const opcionesRangoSueldo = ["0-460", "460-750", "750-1000", "1000+"];
  const opcionesNivelEstudio = [
    "Primaria",
    "Secundaria",
    "Bachillerato",
    "Licenciatura",
    "Técnico",
    "Tecnológico",
    "Superior",
    "Postgrado",
    "Maestría",
    "Doctorado",
    "Especialización",
    "Certificación Profesional",
    "Formación Profesional",
    "Educación Preescolar",
    "Educación Media Superior",
    "Ninguno",
  ];
  const opcionesTipoEmpresa = [
    "Unipersonal",
    "Sociedad",
    "Cooperativa",
    "Asociación",
    "Fundación",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!idEmprendedor) {
      console.error("ID no definido");
      setError(new Error("ID no definido"));
      setLoading(false);
      return;
    }

    const fetchEmprendedor = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7075/api/Emprendedores/${idEmprendedor}`
        );
        setEmprendedor(response.data);
        setEditedEmprendedor(response.data);
        console.log("Datos obtenidos de la API:", response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error.response || error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendedor();
  }, [idEmprendedor]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log("Datos enviados a la API:", editedEmprendedor);
      const response = await axios.put(
        `https://localhost:7075/api/Emprendedores/${idEmprendedor}`,
        editedEmprendedor
      );
      console.log("Datos actualizados:", response.data);
      setEmprendedor(response.data || editedEmprendedor);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar los datos:", error.response || error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedEmprendedor({
      ...editedEmprendedor,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEncuestasClick = () => {
    navigate(`/detalles/${idEmprendedor}/ventanaencuestas`);
  };

  if (loading) {
    return <div className="emprendedor-loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="emprendedor-error">
        Error: {error.response ? error.response.data.message : error.message}
      </div>
    );
  }

  if (!emprendedor) {
    return (
      <div className="emprendedor-not-found">
        No se encontraron datos del emprendedor.
      </div>
    );
  }

  return (
    <div className="emprendedor-app">
      <Header />
      <Sidebar />
      <main className="emprendedor-container">
        <h1 className="emprendedor-main-title">DETALLES DEL EMPRENDEDOR</h1>
        <div className="emprendedor-actions-container">
          <button
            className="emprendedor-action-btn emprendedor-edit-btn"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            {isEditing ? "Guardar Cambios" : "Editar Información"}
          </button>
          <button
            className="emprendedor-action-btn emprendedor-survey-btn"
            onClick={handleEncuestasClick}
          >
            Ver Encuestas
          </button>
          <button
            className="emprendedor-action-btn emprendedor-back-btn"
            onClick={() => navigate(-1)}
          >
            Volver al Listado
          </button>
        </div>
        <div className="emprendedor-card">
          <h2 className="emprendedor-card-header">INFORMACIÓN GENERAL</h2>
          <table className="emprendedor-details-table">
            <tbody>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">
                  NOMBRES Y APELLIDOS:
                </td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editedEmprendedor.nombre}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.nombre
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">EDAD:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="number"
                      name="edad"
                      value={editedEmprendedor.edad}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.edad
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">NIVEL DE ESTUDIO:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <select
                      id="nivelEstudio"
                      name="nivelEstudio"
                      value={editedEmprendedor.nivelEstudio}
                      onChange={handleInputChange}
                      required
                      className="emprendedor-select"
                    >
                      <option value="">Seleccione...</option>
                      {opcionesNivelEstudio.map((opcion, index) => (
                        <option key={index} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    emprendedor.nivelEstudio
                  )}
                </td>
              </tr>

              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">
                  TRABAJO RELACIÓN DEPENDENCIA:
                </td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="trabajoRelacionDependencia"
                      checked={editedEmprendedor.trabajoRelacionDependencia}
                      onChange={handleInputChange}
                    />
                  ) : emprendedor.trabajoRelacionDependencia ? (
                    "Sí"
                  ) : (
                    "No"
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">RANGO DE SUELDO:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <select
                      name="sueldoMensual"
                      value={editedEmprendedor.sueldoMensual}
                      onChange={handleInputChange}
                      className="emprendedor-select"
                    >
                      {opcionesRangoSueldo.map((opcion, index) => (
                        <option key={index} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    emprendedor.sueldoMensual
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">RUC:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      name="ruc"
                      value={editedEmprendedor.ruc}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.ruc
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">EMPLEADOS HOMBRES:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="number"
                      name="empleadosHombres"
                      value={editedEmprendedor.empleadosHombres}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    `${emprendedor.empleadosHombres} EMPLEADOS HOMBRES`
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">EMPLEADOS MUJERES:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="number"
                      name="empleadosMujeres"
                      value={editedEmprendedor.empleadosMujeres}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    `${emprendedor.empleadosMujeres} EMPLEADAS MUJERES`
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">
                  RANGO DE EDAD DE EMPLEADOS:
                </td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <select
                      name="rangoEdadEmpleados"
                      value={editedEmprendedor.rangoEdadEmpleados}
                      onChange={handleInputChange}
                      className="emprendedor-select"
                    >
                      {opcionesRangoEdad.map((opcion, index) => (
                        <option key={index} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    emprendedor.rangoEdadEmpleados
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">TIPO DE EMPRESA:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <select
                      name="tipoEmpresa"
                      value={editedEmprendedor.tipoEmpresa || ""}
                      onChange={handleInputChange}
                      className="emprendedor-select"
                    >
                      <option value="">Seleccione...</option>
                      {opcionesTipoEmpresa.map((opcion, index) => (
                        <option key={index} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    emprendedor.tipoEmpresa || "No especificado"
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">
                  AÑO DE CREACIÓN DE LA EMPRESA:
                </td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="number"
                      name="anoCreacionEmpresa"
                      value={editedEmprendedor.anoCreacionEmpresa}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.anoCreacionEmpresa
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">DIRECCIÓN:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      name="direccion"
                      value={editedEmprendedor.direccion}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.direccion
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">TELÉFONO:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      name="telefono"
                      value={editedEmprendedor.telefono}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.telefono
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">CELULAR:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      name="celular"
                      value={editedEmprendedor.celular}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.celular
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">CORREO:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="email"
                      name="correo"
                      value={editedEmprendedor.correo}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.correo
                  )}
                </td>
              </tr>
              <tr className="emprendedor-detail-row">
                <td className="emprendedor-detail-label">CÉDULA:</td>
                <td className="emprendedor-detail-value">
                  {isEditing ? (
                    <input
                      type="text"
                      name="cedula"
                      value={editedEmprendedor.cedula}
                      onChange={handleInputChange}
                      className="emprendedor-input"
                    />
                  ) : (
                    emprendedor.cedula
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default DetallesEmprendedor;
