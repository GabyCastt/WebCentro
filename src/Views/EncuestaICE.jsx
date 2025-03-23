import { useState, useEffect } from "react";
import "./EncuestaICE.css";

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

const IceSurvey = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentCompetenciaIndex, setCurrentCompetenciaIndex] = useState(0);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://localhost:7075/api/PreguntasIce");
      const data = await response.json();

      const grouped = data.reduce((acc, question) => {
        const compId = question.idCompetencia;
        if (!acc[compId]) acc[compId] = [];
        acc[compId].push(question);
        return acc;
      }, {});

      setQuestions(data);
      setGroupedQuestions(grouped);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  const competenciasIds = Object.keys(groupedQuestions).sort((a, b) => a - b);

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNextCompetencia = () => {
    if (currentCompetenciaIndex < competenciasIds.length - 1) {
      setCurrentCompetenciaIndex(currentCompetenciaIndex + 1);
    } else {
      console.log("Respuestas enviadas:", answers);
      onComplete();
    }
  };

  const currentCompetenciaId = competenciasIds[currentCompetenciaIndex];
  const currentQuestions = groupedQuestions[currentCompetenciaId] || [];

  return (
    <div className="ice-survey-box">
      <p className="ice-survey-type">
        Tipo de encuesta: <strong>ICE</strong>
      </p>

      <p className="ice-category-label">
        Competencia: <strong>{competenciasMap[currentCompetenciaId]}</strong>
      </p>

      {currentQuestions.map((q, idx) => (
        <div key={q.idPregunta} className="ice-question-block">
          <p className="ice-question-text">
            {idx + 1}. {q.textoPregunta}
          </p>
          <div className="ice-answers-container">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                onClick={() => handleAnswer(q.idPregunta, num)}
                className={`ice-answer-circle ${answers[q.idPregunta] === num ? "ice-selected" : ""}`}
              >
                <span className="ice-answer-label">{num}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleNextCompetencia} className="ice-next-button">
        {currentCompetenciaIndex < competenciasIds.length - 1
          ? "Siguiente Competencia"
          : "Finalizar Encuesta"}
      </button>
    </div>
  );
};

export default IceSurvey;
