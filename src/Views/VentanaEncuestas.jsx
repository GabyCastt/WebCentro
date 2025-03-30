import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import "./VentanaEncuestas.css";

const VentanaEncuestas = () => {
  const navigate = useNavigate();
  const { idEmprendedor } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Verificación adicional del ID
  if (!idEmprendedor) {
    return (
      <div className="ven-container">
        <Header />
        <div className="ven-layout">
          <Sidebar />
          <div className="ven-selection">
            <h2 className="ven-title">
              Los resultados aún no están disponibles.
            </h2>
            <button onClick={() => navigate(-2)} className="ven-back-button">
              Regresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSurveySelection = (surveyType) => {
    setSelectedSurvey(surveyType);
    setShowModal(true);
  };

  const proceedToSurvey = () => {
    setShowModal(false);
    if (selectedSurvey === "ice") {
      navigate(`/detalles/${idEmprendedor}/encuestaice`);
    } else if (selectedSurvey === "iepm") {
      navigate(`/detalles/${idEmprendedor}/encuestaiepm`);
    }
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
          alert(errorData.title || "Los resultados aún no están disponibles.");
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
            <button
              onClick={() => handleSurveySelection("ice")}
              className="ven-option-button"
            >
              Ir a Encuesta ICE
            </button>
          </div>

          <div className="ven-option">
            <h3 className="ven-option-title">Encuesta IEPM</h3>
            <p className="ven-option-description">
              Evalúa factores motivacionales y de resiliencia.
            </p>
            <button
              onClick={() => handleSurveySelection("iepm")}
              className="ven-option-button"
            >
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

      {/* Modal de confirmación */}
      {showModal && (
        <div className="ven-modal-overlay">
          <div className="ven-modal">
            <h3>Confirmación</h3>
            <p>
              ¿Estás seguro que deseas comenzar la encuesta{" "}
              {selectedSurvey === "ice" ? "ICE" : "IEPM"}?
            </p>
            <p>
              Una vez iniciada, deberás completarla para obtener resultados.
            </p>
            <div className="ven-modal-buttons">
              <button
                onClick={() => setShowModal(false)}
                className="ven-modal-cancel"
              >
                Cancelar
              </button>
              <button onClick={proceedToSurvey} className="ven-modal-confirm">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentanaEncuestas;
