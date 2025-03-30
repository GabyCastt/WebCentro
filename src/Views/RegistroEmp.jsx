import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegistroEmp.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";

function RegistroEmp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [nuevoEmprendedor, setNuevoEmprendedor] = useState({
    idUsuario: "",
    nombre: "",
    edad: "",
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
  });

  // Verificar autenticación del usuario al cargar el componente
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Intentar obtener datos del usuario desde localStorage
        let usuarioSesion = localStorage.getItem('usuario');
        
        // Si no hay datos en localStorage, verificar si puede haber un token en sessionStorage o cookies como alternativa
        if (!usuarioSesion) {
          console.warn("No se encontró información de usuario en localStorage");
          
          // Redirigir a login si definitivamente no hay datos de usuario
          navigate('/login');
          return;
        }
        
        // Intentar parsear los datos del usuario
        try {
          usuarioSesion = JSON.parse(usuarioSesion);
        } catch (parseError) {
          console.error("Error al parsear los datos del usuario:", parseError);
          // Si hay problemas con el formato, intentar limpiar y redirigir
          localStorage.removeItem('usuario');
          navigate('/login');
          return;
        }
        
        // Verificar si tenemos un objeto con estructura mínima necesaria
        if (!usuarioSesion || (!usuarioSesion.token && !usuarioSesion.idUsuario && !usuarioSesion.id)) {
          console.error("Datos de usuario incompletos:", usuarioSesion);
          navigate('/login');
          return;
        }
        
        // Construir un objeto de usuario con los campos necesarios
        const usuario = {
          idUsuario: usuarioSesion.idUsuario || usuarioSesion.id || "",
          nombre: usuarioSesion.nombre || usuarioSesion.email || usuarioSesion.correo || "Usuario",
          token: usuarioSesion.token || ""
        };
        
        console.log("Usuario recuperado y formateado:", usuario);
        
        // Solo continuar si tenemos al menos un ID de usuario
        if (!usuario.idUsuario) {
          console.error("No se pudo determinar el ID del usuario");
          // Mostrar un mensaje más claro
          alert("Error: No se pudo verificar su identidad. Por favor, inicie sesión nuevamente.");
          navigate('/login');
          return;
        }
        
        // Actualizar el estado con los datos del usuario
        setUsuarioLogueado(usuario);
        setNuevoEmprendedor(prevState => ({
          ...prevState,
          idUsuario: usuario.idUsuario,
        }));
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        navigate('/login');
      }
    };

    checkAuthentication();
  }, [navigate]);

  const opcionesRangoEdad = ["18-25", "26-65", "65+"];
  const opcionesRangoSueldo = ["0-460", "460-750", "750-1500"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoEmprendedor(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar de nuevo la autenticación antes de enviar el formulario
    if (!usuarioLogueado || !nuevoEmprendedor.idUsuario) {
      alert("Error: No hay información de usuario disponible. Por favor, inicie sesión nuevamente.");
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Datos a enviar:", nuevoEmprendedor);
      
      // Configurar los headers con el token si está disponible
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (usuarioLogueado.token) {
        headers['Authorization'] = `Bearer ${usuarioLogueado.token}`;
      }
      
      // Enviar los datos al servidor
      const response = await axios.post(
        "https://localhost:7075/api/Emprendedores",
        nuevoEmprendedor,
        { headers }
      );
      
      console.log("Respuesta exitosa:", response.data);
      navigate(`/emprendedor/${response.data.idEmprendedor}`);
    } catch (error) {
      console.error("Error al registrar:", error);
      
      // Mostrar mensaje de error más descriptivo
      if (error.response) {
        setError(new Error(`Error ${error.response.status}: ${error.response.data.message || 'Error en la respuesta del servidor'}`));
      } else if (error.request) {
        setError(new Error("No se pudo conectar con el servidor. Verifique su conexión a internet."));
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (!usuarioLogueado) {
    return (
      <div className="App">
        <Header />
        <Sidebar />
        <main className="registro-container">
          <h1>Verificando autenticación...</h1>
          <p>Por favor espere mientras verificamos su sesión.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <main className="registro-container">
        <h1>REGISTRO DE EMPRENDEDOR</h1>
        {error && (
          <div className="error-message">
            Error: {error.message}
          </div>
        )}
        <div className="usuario-responsable">
          <p><strong>Responsable del registro:</strong> {usuarioLogueado.nombre}</p>
        </div>
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
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={nuevoEmprendedor.edad}
                  onChange={handleInputChange}
                  required
                />
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
            {/* Resto del formulario se mantiene igual */}
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