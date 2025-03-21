import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./Encuesta.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";

// Mapeo de competencias (para ICE)
const competenciasMap = {
  1: "Comportamiento emprendedor",
  2: "Creatividad",
  3: "Liderazgo",
  4: "Personalidad proactiva",
  5: "Tolerancia a la incertidumbre",
  6: "Trabajo en equipo",
  7: "Pensamiento estratégico",
  8: "Proyección social",
  9: "Orientación financiera",
  10: "Orientación tecnológica e innovación",
};

// Mapeo de dimensiones (para IEPM)
const dimensionesMap = {
  1: "Evaluación de la puesta en marcha",
};

const Survey = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [surveyType, setSurveyType] = useState("ICE");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    fetchQuestions();
  }, [surveyType]);

  // API Preguntas según el tipo de encuesta
  const fetchQuestions = async () => {
    const url =
      surveyType === "ICE"
        ? "https://localhost:7075/api/PreguntasIce"
        : "https://localhost:7075/api/PreguntasIepm";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setQuestions(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  // Nombre de la competencia o dimensión
  const getCategoryName = (id) => {
    if (surveyType === "ICE") {
      return competenciasMap[id] || "Competencia Desconocida";
    } else {
      return dimensionesMap[id] || "Dimensión Desconocida";
    }
  };

  // Maneja Botón "Siguiente"
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (surveyType === "ICE") {
        setSurveyType("IEPM");
      } else {
        alert("Encuesta finalizada");
        navigate("/resultados"); // Redirige a la vista de Resultados
      }
    }
  };

  // Selección de la respuesta
  const handleAnswerClick = (value) => {
    setSelectedAnswer(value);
  };

  return (
    <div className="survey-container">
      <Header />
      <div className="survey-layout">
        <Sidebar />
        <div className="survey-box">
          <p className="survey-type">
            Tipo de encuesta: <strong>{surveyType}</strong>
          </p>

          <p className="category-label">
            {surveyType === "ICE" ? "Competencia: " : "Dimensión: "}
            <strong>
              {getCategoryName(
                surveyType === "ICE"
                  ? questions[currentIndex]?.idCompetencia
                  : questions[currentIndex]?.idDimension
              )}
            </strong>
          </p>

          <p className="question-number">
            Pregunta {currentIndex + 1} de {questions.length}
          </p>

          <p className="question-text">
            {questions[currentIndex]?.textoPregunta || "Cargando pregunta..."}
          </p>

          {/* Opciones de respuesta (1 a 5) */}
          <div className="answers-container">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                onClick={() => handleAnswerClick(num)}
                className={`answer-circle ${
                  selectedAnswer === num ? "selected" : ""
                }`}
              >
                <span className="answer-label">{num}</span>
              </div>
            ))}
          </div>

          <button onClick={handleNext} className="next-button">
            {currentIndex < questions.length - 1 ? "Siguiente" : "Finalizar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Survey;