import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import "./VentanaEncuestas.css";

const VentanaEncuestas = () => {
  const navigate = useNavigate();

  const goToIceSurvey = () => {
    navigate("/encuestaice");
  };

  const goToIepmSurvey = () => {
    navigate("/encuestaiepm");
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
              La encuesta ICE mide las competencias emprendedoras en distintos ámbitos. Está diseñada para evaluar el pensamiento crítico, la proactividad y la resolución de problemas.
            </p>
            <button onClick={goToIceSurvey} className="ven-option-button">
              Ir a Encuesta ICE
            </button>
          </div>

          <div className="ven-option">
            <h3 className="ven-option-title">Encuesta IEPM</h3>
            <p className="ven-option-description">
              La encuesta IEPM se enfoca en el impacto de las experiencias personales en el emprendimiento. Evalúa factores motivacionales y de resiliencia.
            </p>
            <button onClick={goToIepmSurvey} className="ven-option-button">
              Ir a Encuesta IEPM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentanaEncuestas;