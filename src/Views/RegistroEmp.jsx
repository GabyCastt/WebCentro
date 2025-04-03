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
  const [fieldErrors, setFieldErrors] = useState({});
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

  // Opciones para selects
  const opcionesRangoEdad = ["18-25", "26-35", "36-45", "46-59", "60+"];
  const opcionesRangoSueldo = ["0-460", "460-750", "750-1000", "1000+"];
  const opcionesNivelEstudio = [ "Primaria",
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
    "Ninguno"];
  const opcionesTipoEmpresa = ["Unipersonal", "Sociedad", "Cooperativa", "Asociación", "Fundación"];

  // Verificar autenticación del usuario al cargar el componente
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        let usuarioSesion = localStorage.getItem('usuario');
        
        if (!usuarioSesion) {
          console.warn("No se encontró información de usuario en localStorage");
          navigate('/login');
          return;
        }
        
        try {
          usuarioSesion = JSON.parse(usuarioSesion);
        } catch (parseError) {
          console.error("Error al parsear los datos del usuario:", parseError);
          localStorage.removeItem('usuario');
          navigate('/login');
          return;
        }
        
        if (!usuarioSesion || (!usuarioSesion.token && !usuarioSesion.idUsuario && !usuarioSesion.id)) {
          console.error("Datos de usuario incompletos:", usuarioSesion);
          navigate('/login');
          return;
        }
        
        const usuario = {
          idUsuario: usuarioSesion.idUsuario || usuarioSesion.id || "",
          nombre: usuarioSesion.nombre || usuarioSesion.email || usuarioSesion.correo || "Usuario",
          token: usuarioSesion.token || ""
        };
        
        if (!usuario.idUsuario) {
          console.error("No se pudo determinar el ID del usuario");
          alert("Error: No se pudo verificar su identidad. Por favor, inicie sesión nuevamente.");
          navigate('/login');
          return;
        }
        
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

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'nombre':
        if (!value.trim()) error = 'El nombre es requerido';
        else if (value.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
        
      case 'edad':
        if (!value) error = 'La edad es requerida';
        else if (isNaN(value) || parseInt(value) < 18 || parseInt(value) > 120) 
          error = 'La edad debe estar entre 18 y 120 años';
        break;
        
      case 'cedula':
        if (!value) error = 'La cédula es requerida';
        else if (!/^\d{10}$/.test(value)) error = 'La cédula debe tener 10 dígitos';
        break;
        
      case 'ruc':
        // RUC es opcional, pero si tiene valor debe tener 13 dígitos
        if (value && !/^\d{13}$/.test(value)) error = 'El RUC debe tener 13 dígitos';
        break;
        
      case 'correo':
        if (!value) error = 'El correo es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 
          error = 'Por favor ingrese un correo electrónico válido';
        break;
        
      case 'celular':
        if (!value) error = 'El celular es requerido';
        else if (!/^[\d\s-]{7,15}$/.test(value)) 
          error = 'Por favor ingrese un número de celular válido';
        break;
        
      case 'telefono':
        if (value && !/^[\d\s-]{7,15}$/.test(value)) 
          error = 'Por favor ingrese un número de teléfono válido';
        break;
        
      case 'anoCreacionEmpresa':
        const currentYear = new Date().getFullYear();
        if (!value) error = 'El año de creación es requerido';
        else if (isNaN(value) || parseInt(value) < 1900 || parseInt(value) > currentYear) 
          error = `El año debe estar entre 1900 y ${currentYear}`;
        break;
        
      case 'empleadosHombres':
      case 'empleadosMujeres':
        if (isNaN(value) || parseInt(value) < 0) 
          error = 'Debe ser un número positivo';
        break;
        
      case 'nivelEstudio':
      case 'tipoEmpresa':
        if (!value) error = 'Este campo es requerido';
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    // Validar el campo en tiempo real
    const error = validateField(name, fieldValue);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
    
    setNuevoEmprendedor(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Validar todos los campos requeridos
    Object.keys(nuevoEmprendedor).forEach(key => {
      if (key !== 'telefono' && key !== 'trabajoRelacionDependencia' && key !== 'ruc') {
        const error = validateField(key, nuevoEmprendedor[key]);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    });
    
    // Validación de coherencia de datos
    if (nuevoEmprendedor.trabajoRelacionDependencia && nuevoEmprendedor.sueldoMensual === "0-460") {
      errors.sueldoMensual = 'Si tiene trabajo en relación de dependencia, su sueldo no puede estar en el rango más bajo';
      isValid = false;
    }
    
    const totalEmpleados = parseInt(nuevoEmprendedor.empleadosHombres) + parseInt(nuevoEmprendedor.empleadosMujeres);
    if (totalEmpleados > 0 && !nuevoEmprendedor.ruc) {
      errors.ruc = 'Si tiene empleados, debe tener RUC';
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!usuarioLogueado || !nuevoEmprendedor.idUsuario) {
      alert("Error: No hay información de usuario disponible. Por favor, inicie sesión nuevamente.");
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      setError(new Error('Por favor corrija los errores en el formulario'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (usuarioLogueado.token) {
        headers['Authorization'] = `Bearer ${usuarioLogueado.token}`;
      }
      
      // Preparar los datos para enviar, con valor por defecto para RUC si está vacío
      const datosParaEnviar = {
        ...nuevoEmprendedor,
        ruc: nuevoEmprendedor.ruc || "0" // Si RUC está vacío, se envía "0"
      };
      
      const response = await axios.post(
        "https://localhost:7075/api/Emprendedores",
        datosParaEnviar,
        { headers }
      );
      
      navigate(`/emprendedor/${response.data.idEmprendedor}`);
    } catch (error) {
      console.error("Error al registrar:", error);
      
      if (error.response) {
        if (error.response.data.errors) {
          const serverErrors = {};
          Object.keys(error.response.data.errors).forEach(key => {
            serverErrors[key] = error.response.data.errors[key].join(', ');
          });
          setFieldErrors(serverErrors);
          setError(new Error("Por favor corrija los errores en el formulario"));
        } else {
          setError(new Error(`Error ${error.response.status}: ${error.response.data.message || 'Error en el servidor'}`));
        }
      } else if (error.request) {
        setError(new Error("No se pudo conectar con el servidor. Verifique su conexión a internet."));
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

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
                  className={fieldErrors.nombre ? 'error-input' : ''}
                />
                {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
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
                  min="18"
                  max="120"
                  className={fieldErrors.edad ? 'error-input' : ''}
                />
                {fieldErrors.edad && <span className="field-error">{fieldErrors.edad}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="nivelEstudio">NIVEL DE ESTUDIO:</label>
                <select
                  id="nivelEstudio"
                  name="nivelEstudio"
                  value={nuevoEmprendedor.nivelEstudio}
                  onChange={handleInputChange}
                  required
                  className={fieldErrors.nivelEstudio ? 'error-input' : ''}
                >
                  <option value="">Seleccione...</option>
                  {opcionesNivelEstudio.map((opcion, index) => (
                    <option key={index} value={opcion}>{opcion}</option>
                  ))}
                </select>
                {fieldErrors.nivelEstudio && <span className="field-error">{fieldErrors.nivelEstudio}</span>}
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
                  className={fieldErrors.sueldoMensual ? 'error-input' : ''}
                >
                  {opcionesRangoSueldo.map((opcion, index) => (
                    <option key={index} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
                {fieldErrors.sueldoMensual && <span className="field-error">{fieldErrors.sueldoMensual}</span>}
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
                  maxLength="10"
                  pattern="\d{10}"
                  className={fieldErrors.cedula ? 'error-input' : ''}
                />
                {fieldErrors.cedula && <span className="field-error">{fieldErrors.cedula}</span>}
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
                  className={fieldErrors.direccion ? 'error-input' : ''}
                />
                {fieldErrors.direccion && <span className="field-error">{fieldErrors.direccion}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="telefono">TELÉFONO:</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={nuevoEmprendedor.telefono}
                  onChange={handleInputChange}
                  className={fieldErrors.telefono ? 'error-input' : ''}
                />
                {fieldErrors.telefono && <span className="field-error">{fieldErrors.telefono}</span>}
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
                  className={fieldErrors.celular ? 'error-input' : ''}
                />
                {fieldErrors.celular && <span className="field-error">{fieldErrors.celular}</span>}
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
                  className={fieldErrors.correo ? 'error-input' : ''}
                />
                {fieldErrors.correo && <span className="field-error">{fieldErrors.correo}</span>}
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
                  maxLength="13"
                  pattern="\d{13}"
                  className={fieldErrors.ruc ? 'error-input' : ''}
                  placeholder="Opcional"
                />
                {fieldErrors.ruc && <span className="field-error">{fieldErrors.ruc}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="tipoEmpresa">TIPO DE EMPRESA:</label>
                <select
                  id="tipoEmpresa"
                  name="tipoEmpresa"
                  value={nuevoEmprendedor.tipoEmpresa}
                  onChange={handleInputChange}
                  required
                  className={fieldErrors.tipoEmpresa ? 'error-input' : ''}
                >
                  <option value="">Seleccione...</option>
                  {opcionesTipoEmpresa.map((opcion, index) => (
                    <option key={index} value={opcion}>{opcion}</option>
                  ))}
                </select>
                {fieldErrors.tipoEmpresa && <span className="field-error">{fieldErrors.tipoEmpresa}</span>}
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
                  min="1900"
                  max={new Date().getFullYear()}
                  className={fieldErrors.anoCreacionEmpresa ? 'error-input' : ''}
                />
                {fieldErrors.anoCreacionEmpresa && <span className="field-error">{fieldErrors.anoCreacionEmpresa}</span>}
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
                  className={fieldErrors.empleadosHombres ? 'error-input' : ''}
                />
                {fieldErrors.empleadosHombres && <span className="field-error">{fieldErrors.empleadosHombres}</span>}
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
                  className={fieldErrors.empleadosMujeres ? 'error-input' : ''}
                />
                {fieldErrors.empleadosMujeres && <span className="field-error">{fieldErrors.empleadosMujeres}</span>}
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
      </main>
    </div>
  );
}

export default RegistroEmp;