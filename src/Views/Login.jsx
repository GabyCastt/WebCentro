import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch("https://localhost:7075/api/Usuario", {
        method: "GET",
        headers: {
          "accept": "text/plain",
        },
      });

      if (!response.ok) {
        throw new Error("Error al contactar con la API");
      }

      const data = await response.json();

      const user = data.find(
        (user) => user.correo === email && user.contraseña === password
      );

      if (user) {
        setUser(user);
        navigate("/"); 
      } else {
        setErrorMessage("Credenciales incorrectas");
      }
    } catch (error) {
      setErrorMessage("Error al conectar con la API. Intenta nuevamente.");
      console.error(error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/RegistrarRol");
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
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
      <button className="register-btn" onClick={handleRegisterRedirect}>
        ¿No tienes una cuenta? Regístrate
      </button>
    </div>
  );
};

export default Login;
