import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import "./RegistroEmp.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";

function RegistroEmp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [nuevoEmprendedor, setNuevoEmprendedor] = useState({
    nombre: "",
    edad: "18-25",
    nivelEstudio: "",
    trabajoRelacionDependencia: false,
    sueldoMensual: "0-460",
    ruc: "",
    empleadosHombres: 0,
    empleadosMujeres: 0,
    rangoEdadEmpleados: "18-25",
    tipoEmpresa: "",
    anoCreacionEmpresa: new Date().getFullYear(),
    direccion: "",
    telefono: "",
    celular: "",
    correo: "",
    cedula: "",
    nombreProyecto: "",
    descripcionProyecto: "",
    sector: "",
    fechaRegistro: new Date().toISOString().split('T')[0],
    datosEmps: []
  });

  // Rangos de edad para el emprendedor y empleados
  const opcionesRangoEdad = ["18-25", "26-65", "65+"];
  
  // Rangos de sueldo
  const opcionesRangoSueldo = ["0-460", "460-750", "750-1500"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoEmprendedor({
      ...nuevoEmprendedor,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Datos a enviar:", nuevoEmprendedor);
      
      // const response = await axios.post(
      //   "https://localhost:7075/api/Emprendedores",
      //   nuevoEmprendedor
      // );
      // console.log("Respuesta:", response.data);
      
      // // Redirigir a la página de detalles con el ID del nuevo emprendedor
      // navigate(`/emprendedor/${response.data.idEmprendedor}`);
      
      // Código temporal mientras no hay backend:
      setTimeout(() => {
        alert("Emprendedor registrado correctamente (simulado)");
        // Simulamos un ID para la redirección
        navigate(`/emprendedor/1`);
      }, 1000);
      
    } catch (error) {
      console.error("Error al registrar el emprendedor:", error.response || error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <main className="registro-container">
        <h1>REGISTRO DE EMPRENDEDOR</h1>
        
        {error && (
          <div className="error-message">
            Error: {error.response ? error.response.data.message : error.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="info-box">
          <h2>INFORMACIÓN</h2>
          <div className="form-grid">
            {/* Información Personal */}
            <div className="form-section">
              <h3>Datos Personales</h3>
              
              <div className="form-group">
                <label htmlFor="nombre">NOMBRES Y APELLIDOS:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nuevoEmprendedor.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edad">EDAD:</label>
                <select
                  id="edad"
                  name="edad"
                  value={nuevoEmprendedor.edad}
                  onChange={handleInputChange}
                  required
                >
                  {opcionesRangoEdad.map((opcion, index) => (
                    <option key={index} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="nivelEstudio">NIVEL DE ESTUDIO:</label>
                <input
                  type="text"
                  id="nivelEstudio"
                  name="nivelEstudio"
                  value={nuevoEmprendedor.nivelEstudio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label htmlFor="trabajoRelacionDependencia">
                  TRABAJO RELACIÓN DEPENDENCIA:
                </label>
                <input
                  type="checkbox"
                  id="trabajoRelacionDependencia"
                  name="trabajoRelacionDependencia"
                  checked={nuevoEmprendedor.trabajoRelacionDependencia}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sueldoMensual">RANGO DE SUELDO:</label>
                <select
                  id="sueldoMensual"
                  name="sueldoMensual"
                  value={nuevoEmprendedor.sueldoMensual}
                  onChange={handleInputChange}
                  required
                >
                  {opcionesRangoSueldo.map((opcion, index) => (
                    <option key={index} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="cedula">CÉDULA:</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={nuevoEmprendedor.cedula}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Información de Contacto */}
            <div className="form-section">
              <h3>Datos de Contacto</h3>
              
              <div className="form-group">
                <label htmlFor="direccion">DIRECCIÓN:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={nuevoEmprendedor.direccion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono">TELÉFONO:</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={nuevoEmprendedor.telefono}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="celular">CELULAR:</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  value={nuevoEmprendedor.celular}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="correo">CORREO:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={nuevoEmprendedor.correo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Información de la Empresa */}
            <div className="form-section">
              <h3>Datos de la Empresa</h3>
              
              <div className="form-group">
                <label htmlFor="ruc">RUC:</label>
                <input
                  type="text"
                  id="ruc"
                  name="ruc"
                  value={nuevoEmprendedor.ruc}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tipoEmpresa">TIPO DE EMPRESA:</label>
                <input
                  type="text"
                  id="tipoEmpresa"
                  name="tipoEmpresa"
                  value={nuevoEmprendedor.tipoEmpresa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="anoCreacionEmpresa">AÑO DE CREACIÓN:</label>
                <input
                  type="number"
                  id="anoCreacionEmpresa"
                  name="anoCreacionEmpresa"
                  value={nuevoEmprendedor.anoCreacionEmpresa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              
              
              <div className="form-group">
                <label htmlFor="descripcionProyecto">DESCRIPCIÓN:</label>
                <textarea
                  id="descripcionProyecto"
                  name="descripcionProyecto"
                  value={nuevoEmprendedor.descripcionProyecto}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Información de Empleados */}
            <div className="form-section">
              <h3>Datos de Empleados</h3>
              
              <div className="form-group">
                <label htmlFor="empleadosHombres">EMPLEADOS HOMBRES:</label>
                <input
                  type="number"
                  id="empleadosHombres"
                  name="empleadosHombres"
                  value={nuevoEmprendedor.empleadosHombres}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="empleadosMujeres">EMPLEADOS MUJERES:</label>
                <input
                  type="number"
                  id="empleadosMujeres"
                  name="empleadosMujeres"
                  value={nuevoEmprendedor.empleadosMujeres}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rangoEdadEmpleados">RANGO DE EDAD EMPLEADOS:</label>
                <select
                  id="rangoEdadEmpleados"
                  name="rangoEdadEmpleados"
                  value={nuevoEmprendedor.rangoEdadEmpleados}
                  onChange={handleInputChange}
                  required
                >
                  {opcionesRangoEdad.map((opcion, index) => (
                    <option key={index} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGISTRAR"}
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => navigate(-1)}
            >
              CANCELAR
            </button>
          </div>
        </form>
        
        <button className="back-btn" onClick={() => navigate(-1)}>
          Regresar
        </button>
      </main>
    </div>
  );
}

export default RegistroEmp;