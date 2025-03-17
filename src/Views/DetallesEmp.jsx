import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetallesEmp.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";

function DetallesEmp() {
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
    datosEmps: [], // Campo anidado
  });

  // Rangos de edad para el emprendedor y empleados
  const opcionesRangoEdad = ["18-25", "26-65", "65+"];

  // Rangos de sueldo
  const opcionesRangoSueldo = ["0-460", "460-750", "750-1500"];

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
        setEditedEmprendedor(response.data); // Inicializa los datos editables
        console.log("Datos obtenidos de la API:", response.data); // Verifica los datos obtenidos
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
      console.log("Datos enviados a la API:", editedEmprendedor); // Verifica los datos enviados
      const response = await axios.put(
        `https://localhost:7075/api/Emprendedores/${idEmprendedor}`,
        editedEmprendedor
      );
      console.log("Datos actualizados:", response.data); // Verifica la respuesta
      setEmprendedor(response.data || editedEmprendedor); // Actualiza con la respuesta o con editedEmprendedor
      setIsEditing(false); // Desactiva el modo de edición
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

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Error: {error.response ? error.response.data.message : error.message}
      </div>
    );
  }

  if (!emprendedor) {
    return <div>No se encontraron datos del emprendedor.</div>;
  }

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <main className="detalles-container">
        <h1>DETALLES EMPRENDEDOR</h1>
        <div className="info-box">
          <h2>INFORMACIÓN</h2>
          <table className="details-table">
            <tbody>
              {/* Nombre */}
              <tr>
                <td>NOMBRES Y APELLIDOS:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editedEmprendedor.nombre}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.nombre
                  )}
                </td>
              </tr>

              {/* Edad */}
              <tr>
                <td>EDAD:</td>
                <td>
                  {isEditing ? (
                    <select
                      name="edad"
                      value={editedEmprendedor.edad}
                      onChange={handleInputChange}
                    >
                      {opcionesRangoEdad.map((opcion, index) => (
                        <option key={index} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    emprendedor.edad
                  )}
                </td>
              </tr>

              {/* Nivel de Estudio */}
              <tr>
                <td>NIVEL DE ESTUDIO:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nivelEstudio"
                      value={editedEmprendedor.nivelEstudio}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.nivelEstudio
                  )}
                </td>
              </tr>

              {/* Trabajo Relación Dependencia */}
              <tr>
                <td>TRABAJO RELACIÓN DEPENDENCIA:</td>
                <td>
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

              {/* Sueldo Mensual */}
              <tr>
                <td>RANGO DE SUELDO:</td>
                <td>
                  {isEditing ? (
                    <select
                      name="sueldoMensual"
                      value={editedEmprendedor.sueldoMensual}
                      onChange={handleInputChange}
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

              {/* RUC */}
              <tr>
                <td>RUC:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ruc"
                      value={editedEmprendedor.ruc}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.ruc
                  )}
                </td>
              </tr>

              {/* Empleados Hombres */}
              <tr>
                <td>EMPLEADOS HOMBRES:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      name="empleadosHombres"
                      value={editedEmprendedor.empleadosHombres}
                      onChange={handleInputChange}
                    />
                  ) : (
                    `${emprendedor.empleadosHombres} EMPLEADOS HOMBRES`
                  )}
                </td>
              </tr>

              {/* Empleados Mujeres */}
              <tr>
                <td>EMPLEADOS MUJERES:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      name="empleadosMujeres"
                      value={editedEmprendedor.empleadosMujeres}
                      onChange={handleInputChange}
                    />
                  ) : (
                    `${emprendedor.empleadosMujeres} EMPLEADAS MUJERES`
                  )}
                </td>
              </tr>

              {/* Rango de Edad de Empleados */}
              <tr>
                <td>RANGO DE EDAD DE EMPLEADOS:</td>
                <td>
                  {isEditing ? (
                    <select
                      name="rangoEdadEmpleados"
                      value={editedEmprendedor.rangoEdadEmpleados}
                      onChange={handleInputChange}
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

              {/* Tipo de Empresa */}
              <tr>
                <td>TIPO DE EMPRESA:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="tipoEmpresa"
                      value={editedEmprendedor.tipoEmpresa}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.tipoEmpresa
                  )}
                </td>
              </tr>

              {/* Año de Creación de la Empresa */}
              <tr>
                <td>AÑO DE CREACIÓN DE LA EMPRESA:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      name="anoCreacionEmpresa"
                      value={editedEmprendedor.anoCreacionEmpresa}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.anoCreacionEmpresa
                  )}
                </td>
              </tr>

              {/* Dirección */}
              <tr>
                <td>DIRECCIÓN:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="direccion"
                      value={editedEmprendedor.direccion}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.direccion
                  )}
                </td>
              </tr>

              {/* Teléfono */}
              <tr>
                <td>TELÉFONO:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="telefono"
                      value={editedEmprendedor.telefono}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.telefono
                  )}
                </td>
              </tr>

              {/* Celular */}
              <tr>
                <td>CELULAR:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="celular"
                      value={editedEmprendedor.celular}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.celular
                  )}
                </td>
              </tr>

              {/* Correo */}
              <tr>
                <td>CORREO:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      name="correo"
                      value={editedEmprendedor.correo}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.correo
                  )}
                </td>
              </tr>

              {/* Cédula */}
              <tr>
                <td>CÉDULA:</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="cedula"
                      value={editedEmprendedor.cedula}
                      onChange={handleInputChange}
                    />
                  ) : (
                    emprendedor.cedula
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button-group">
          <button
            className="edit-btn"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            {isEditing ? "Guardar" : "EDITAR"}
          </button>
          <button className="report-btn">Generar Reporte</button>
          <button className="survey-btn">Agregar Resultado Encuesta</button>

          <button className="back-btn" onClick={() => navigate(-1)}> Regresar </button>
        </div>
      </main>
    </div>
  );
}

export default DetallesEmp;