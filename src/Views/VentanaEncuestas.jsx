import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import "./VentanaEncuestas.css";

const SurveyManager = () => {
  const navigate = useNavigate();

  const goToIceSurvey = () => {
    navigate("/encuestaice");
  };

  const goToIepmSurvey = () => {
    navigate("/encuestaiepm");
  };

  return (
    <div className="survey-container">
      <Header />
      <div className="survey-layout">
        <Sidebar />
        <div className="survey-selection">
          <h2>Selecciona la Encuesta a Realizar</h2>

          <div className="survey-option">
            <h3>Encuesta ICE</h3>
            <p>La encuesta ICE mide las competencias emprendedoras en distintos ámbitos. Está diseñada para evaluar el pensamiento crítico, la proactividad y la resolución de problemas.</p>
            <button onClick={goToIceSurvey}>Ir a Encuesta ICE</button>
          </div>

          <div className="survey-option">
            <h3>Encuesta IEPM</h3>
            <p>La encuesta IEPM se enfoca en el impacto de las experiencias personales en el emprendimiento. Evalúa factores motivacionales y de resiliencia.</p>
            <button onClick={goToIepmSurvey}>Ir a Encuesta IEPM</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyManager;
