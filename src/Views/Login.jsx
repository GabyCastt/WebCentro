import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://localhost:7075/api/Usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "text/plain",
        },
        body: JSON.stringify({
          nombre: email,  
          contraseña: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas o error al contactar la API");
      }

      const user = await response.json();

      setUser(user);
      localStorage.setItem('usuario', JSON.stringify(user));
      navigate("/"); 
    } catch (error) {
      setErrorMessage("Error al conectar con la API o credenciales inválidas.");
      console.error(error);
    }
  };

  const handleRecoverPassword = async () => {
    if (!recoveryEmail) {
      setErrorMessage("Por favor, ingresa un correo electrónico en el modal.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7075/api/Usuario/recuperar-contrasena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "text/plain",
        },
        body: JSON.stringify({ correo: recoveryEmail }),
      });

      if (!response.ok) {
        throw new Error("Error al intentar recuperar la contraseña");
      }

      setSuccessMessage("Se ha enviado un correo para recuperar tu contraseña.");
      setErrorMessage("");
      setShowModal(false);
      setRecoveryEmail("");
    } catch (error) {
      setErrorMessage("No se pudo enviar el correo de recuperación.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>

      <button className="recover-btn" onClick={() => setShowModal(true)}>
        ¿Olvidaste tu contraseña?
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Recuperar Contraseña</h3>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleRecoverPassword}>Enviar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
