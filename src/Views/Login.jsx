import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Ingrese un correo electrónico válido");
      return false;
    }
    if (email.includes(' ')) {
      setEmailError("El correo no debe contener espacios en blanco");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos una letra mayúscula");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un número");
      return false;
    }
    if (password.includes(' ')) {
      setPasswordError("La contraseña no debe contener espacios en blanco");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validar email y contraseña antes de enviar
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsProcessing(true);
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

      const data = await response.json();
      
      // Decodificar el token JWT para obtener los datos del usuario
      const token = data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Crear un objeto de usuario con los datos del token
      const user = {
        idUsuario: payload.idUsuario,
        nombre: email,
        token: token,
        tipoUsuario: payload.TipoUsuario
      };
      
      // Guardar usuario en estado y localStorage
      setUser(user);
      localStorage.setItem('usuario', JSON.stringify(user));
      
      navigate("/"); 
    } catch (error) {
      setErrorMessage("Error al conectar con la API o credenciales inválidas.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecoverPassword = async () => {
    if (!recoveryEmail) {
      setErrorMessage("Por favor, ingresa un correo electrónico en el modal.");
      return;
    }
    
    if (!validateEmail(recoveryEmail)) {
      return;
    }
    
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };

  // Validaciones en tiempo real mientras el usuario escribe
  useEffect(() => {
    if (email) validateEmail(email);
  }, [email]);

  useEffect(() => {
    if (password) validatePassword(password);
  }, [password]);

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
          {emailError && <p className="field-error">{emailError}</p>}
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
          {passwordError && <p className="field-error">{passwordError}</p>}
          <p className="password-requirements">
            La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas y números.
          </p>
        </div>
        <button 
          type="submit" 
          disabled={isProcessing || emailError || passwordError}
        >
          {isProcessing ? "Procesando..." : "Iniciar Sesión"}
        </button>
      </form>
      <button 
        className="recover-btn" 
        onClick={() => setShowModal(true)}
        disabled={isProcessing}
      >
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
            {emailError && <p className="field-error">{emailError}</p>}
            <div className="modal-buttons">
              <button 
                onClick={handleRecoverPassword}
                disabled={isProcessing}
              >
                {isProcessing ? "Enviando..." : "Enviar"}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                disabled={isProcessing}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;