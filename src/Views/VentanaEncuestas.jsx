import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import "./VentanaEncuestas.css";

const VentanaEncuestas = () => {
  const navigate = useNavigate();
  const { idEmprendedor } = useParams();

  // Verificación adicional del ID
  if (!idEmprendedor) {
    return (
      <div className="ven-container">
        <Header />
        <div className="ven-layout">
          <Sidebar />
          <div className="ven-selection">
            <h2 className="ven-title">Los resultados aún no están disponibles.</h2>
            <button onClick={() => navigate(-2)} className="ven-back-button">
              Regresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const goToIceSurvey = () => {
    navigate(`/detalles/${idEmprendedor}/encuestaice`);
  };

  const goToIepmSurvey = () => {
    navigate(`/detalles/${idEmprendedor}/encuestaiepm`);
  };

  const goToResults = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    const checkResults = async () => {
      try {
        const response = await fetch(`/api/resultados/${idEmprendedor}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          navigate(`/detalles/${idEmprendedor}/resultados`);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkResults, 1000);
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
            errorData.title || "Los resultados aún no están disponibles."
          );
        }
      } catch (error) {
        console.error("Error de red:", error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkResults, 1000);
        } else {
          alert("Error de conexión. Intenta nuevamente.");
        }
      }
    };

    checkResults();
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="ven-container">
      <Header />
      <div className="ven-layout">
        <Sidebar />
        <div className="ven-selection">
          <h2 className="ven-title">ENCUESTAS</h2>

          <div className="ven-option">
            <h3 className="ven-option-title">Encuesta ICE</h3>
            <p className="ven-option-description">
              La encuesta ICE mide las competencias emprendedoras en distintos
              ámbitos.
            </p>
            <button onClick={goToIceSurvey} className="ven-option-button">
              Ir a Encuesta ICE
            </button>
          </div>

          <div className="ven-option">
            <h3 className="ven-option-title">Encuesta IEPM</h3>
            <p className="ven-option-description">
              Evalúa factores motivacionales y de resiliencia.
            </p>
            <button onClick={goToIepmSurvey} className="ven-option-button">
              Ir a Encuesta IEPM
            </button>
          </div>

          <div className="ven-option">
            <h3 className="ven-option-title">Resultados</h3>
            <p className="ven-option-description">
              Revisa los resultados de las encuestas.
            </p>
            <button onClick={goToResults} className="ven-option-button">
              Ver Resultados
            </button>
            <button onClick={goBack} className="ven-back-button">
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentanaEncuestas;