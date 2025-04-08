import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EncuestaICE.css";

const EncuestaICE = () => {
  const [questions, setQuestions] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [currentCompetenciaIndex, setCurrentCompetenciaIndex] = useState(0);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { idEmprendedor } = useParams();

  useEffect(() => {
    fetchQuestionsAndCompetencias();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCompetenciaIndex]);

  const fetchQuestionsAndCompetencias = async () => {
    try {
      const [preguntasResponse, competenciasResponse] = await Promise.all([
        fetch("https://localhost:7075/api/PreguntasIce"),
        fetch("https://localhost:7075/api/Competencia")
      ]);

      const [preguntasData, competenciasData] = await Promise.all([
        preguntasResponse.json(),
        competenciasResponse.json()
      ]);

      const grouped = preguntasData.reduce((acc, question) => {
        const compId = question.idCompetencia;
        if (!acc[compId]) acc[compId] = [];
        acc[compId].push(question);
        return acc;
      }, {});

      setQuestions(preguntasData);
      setGroupedQuestions(grouped);
      setCompetencias(competenciasData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      alert("No se pudieron cargar los datos. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextCompetencia = () => {
    const currentCompetenciaId = competenciasIds[currentCompetenciaIndex];
    const currentQuestions = groupedQuestions[currentCompetenciaId] || [];

    const allAnswered = currentQuestions.every(
      q => answers[q.idPregunta] !== undefined
    );

    if (!allAnswered) {
      alert("Responde todas las preguntas antes de continuar.");
      return;
    }

    if (currentCompetenciaIndex < competenciasIds.length - 1) {
      setCurrentCompetenciaIndex(prev => prev + 1);
    }
  };

  const handlePreviousCompetencia = () => {
    if (currentCompetenciaIndex > 0) {
      setCurrentCompetenciaIndex(prev => prev - 1);
    }
  };

  const enviarRespuestas = async () => {
    if (!idEmprendedor) {
      alert("El ID del emprendedor no es válido.");
      return;
    }

    // Nueva estructura de datos para el backend
    const requestData = {
      emprendedorId: parseInt(idEmprendedor, 10),
      respuestas: Object.keys(answers).map(idPregunta => ({
        idEmprendedor: parseInt(idEmprendedor, 10),
        valorRespuesta: answers[idPregunta],
        idPregunta: parseInt(idPregunta, 10)
      }))
    };

    try {
      const response = await fetch(
        `https://localhost:7075/api/EncuestasIce/procesar-encuesta`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar las respuestas");
      }

      alert("Encuesta finalizada correctamente.");
      navigate("/ventanaencuestas");
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
      alert("Hubo un error al finalizar la encuesta. Inténtalo de nuevo.");
    }
  };

  const handleFinalizarEncuesta = () => {
    const allQuestionsAnswered = competenciasIds.every(compId => {
      const questions = groupedQuestions[compId] || [];
      return questions.every(q => answers[q.idPregunta] !== undefined);
    });

    if (!allQuestionsAnswered) {
      alert("Por favor, responde todas las preguntas antes de finalizar la encuesta.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas finalizar la encuesta?")) {
      enviarRespuestas();
    }
  };

  const competenciasIds = Object.keys(groupedQuestions).sort((a, b) => a - b);
  const currentCompetenciaId = competenciasIds[currentCompetenciaIndex];
  const currentQuestions = groupedQuestions[currentCompetenciaId] || [];
  const isLastCompetencia = currentCompetenciaIndex === competenciasIds.length - 1;
  const isFirstCompetencia = currentCompetenciaIndex === 0;
  const currentCompetencia = competencias.find(
    c => c.idCompetencia === parseInt(currentCompetenciaId, 10)
  );

  const getScale = (competenciaId) => {
    const id = parseInt(competenciaId, 10);
    if (id >= 1 && id <= 6) {
      return [1, 2, 3, 4, 5]; // Escala de 1 a 5
    } else if (id >= 7 && id <= 10) {
      return [1, 3, 5]; // Escala de 1, 3, 5
    }
    return [];
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="ice-container">
      <p className="ice-survey-type">
        Tipo de encuesta: <strong>ICE</strong>
      </p>

      <p className="ice-category-label">
        Competencia:{" "}
        <strong>
          {currentCompetencia
            ? currentCompetencia.nombreCompetencia
            : "Cargando..."}
        </strong>
      </p>

      <p className="ice-instructions">
        El presente cuestionario tiene el objetivo de evaluar su posibilidad de emprender 
        adecuadamente una empresa. La forma de responder se especifica en cada caso:
      </p>

      <p className="ice-instructions-scale">
        {parseInt(currentCompetenciaId, 10) <= 6
          ? "Escala: 5: Siempre; 4: Casi siempre; 3: Muchas veces; 2: A veces; 1: Nunca."
          : "Escala: 5: Sí; 3: Medianamente; 1: No."}
      </p>

      {currentQuestions.map((q, idx) => (
        <div key={q.idPregunta} className="ice-question-block">
          <p className="ice-question-text">
            {idx + 1}. {q.textoPregunta}
          </p>
          <div className="ice-answers-container">
            {getScale(currentCompetenciaId).map(num => (
              <div key={num} className="ice-answer-wrapper">
                <div
                  onClick={() => handleAnswer(q.idPregunta, num)}
                  className={`ice-answer-circle ${
                    answers[q.idPregunta] === num ? "ice-selected" : ""
                  }`}
                >
                  <span className="ice-answer-label">{num}</span>
                </div>
                <span className="ice-scale-label">
                  {parseInt(currentCompetenciaId, 10) <= 6
                    ? num === 1
                      ? "Nunca"
                      : num === 2
                      ? "A veces"
                      : num === 3
                      ? "Muchas veces"
                      : num === 4
                      ? "Casi siempre"
                      : "Siempre"
                    : num === 1
                    ? "No"
                    : num === 3
                    ? "Medianamente"
                    : "Sí"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="ice-navigation-buttons">
        {!isFirstCompetencia && (
          <button
            onClick={handlePreviousCompetencia}
            className="ice-prev-button"
          >
            Competencia Anterior
          </button>
        )}

        {!isLastCompetencia ? (
          <button onClick={handleNextCompetencia} className="ice-next-button">
            Siguiente Competencia
          </button>
        ) : (
          <button
            onClick={handleFinalizarEncuesta}
            className="ice-finalizar-button"
          >
            Finalizar Encuesta
          </button>
        )}
      </div>

      <p className="ice-progress">
        Progreso: {currentCompetenciaIndex + 1} / {competenciasIds.length}
      </p>
    </div>
  );
};

export default EncuestaICE;