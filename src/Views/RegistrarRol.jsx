import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './RegistrarRol.css';

const RegistrarRol = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("Administrador");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // Nuevo estado para manejar la navegación
  const navigate = useNavigate();

  useEffect(() => {
    if (isRegistered) {
      // Navegar solo si la operación fue exitosa
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [isRegistered, navigate]); // Dependencia de 'isRegistered'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!contraseña) {
      setErrorMessage("La contraseña es obligatoria.");
      return;
    }

    const nuevoUsuario = {
      idUsuario: 0,
      nombre: nombre,
      correo: correo,
      contraseña: contraseña,
      tipoUsuario: tipoUsuario,
      fechaCreacion: new Date().toISOString(),
      emprendedores: []
    };

    console.log(nuevoUsuario);

    try {
      const response = await fetch("https://localhost:7075/api/Usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        setSuccessMessage("¡Usuario registrado exitosamente!");
        setIsRegistered(true); // Cambiar el estado para indicar que la operación fue exitosa
      } else {
        const errorText = await response.text();
        console.error("Error en la API:", errorText);
        setErrorMessage("Error al registrar. Revisa los datos.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage("No se pudo conectar con la API.");
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre y Apellido:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo de Usuario:</label>
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            required
          >
            <option value="Administrador">Administrador</option>
            <option value="Reportes">Reportería</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>

      <button className="back-to-login" onClick={() => navigate("/login")}>
        Regresar al Login
      </button>
    </div>
  );
};

export default RegistrarRol;
