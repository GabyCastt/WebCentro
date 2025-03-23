import { useState, useEffect } from "react";
import "./EncuestaIEPM.css";

const dimensionesMap = {
  1: "Evaluación de la puesta en marcha",
};

const IepmSurvey = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://localhost:7075/api/PreguntasIepm");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  const getCategoryName = (id) => {
    return dimensionesMap[id] || "Dimensión Desconocida";
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleAnswerClick = (value) => {
    setSelectedAnswer(value);
  };

  return (
    <div className="survey-box">
      <p className="survey-type">
        Tipo de encuesta: <strong>IEPM</strong>
      </p>

      <p className="category-label">
        Dimensión: <strong>{getCategoryName(questions[currentIndex]?.idDimension)}</strong>
      </p>

      <p className="question-number">
        Pregunta {currentIndex + 1} de {questions.length}
      </p>

      <p className="question-text">
        {questions[currentIndex]?.textoPregunta || "Cargando pregunta..."}
      </p>

      <div className="answers-container">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            onClick={() => handleAnswerClick(num)}
            className={`answer-circle ${selectedAnswer === num ? "selected" : ""}`}
          >
            <span className="answer-label">{num}</span>
          </div>
        ))}
      </div>

      <button onClick={handleNext} className="next-button">
        {currentIndex < questions.length - 1 ? "Siguiente" : "Finalizar"}
      </button>
    </div>
  );
};

export default IepmSurvey;