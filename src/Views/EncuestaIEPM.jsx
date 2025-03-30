import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EncuestaIEPM.css";

const IepmSurvey = () => {
  const { idEmprendedor } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [currentDestinatario, setCurrentDestinatario] = useState(null);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showUnansweredAlert, setShowUnansweredAlert] = useState(false);

  useEffect(() => {
    if (!idEmprendedor) {
      setError("No se ha proporcionado un ID de emprendedor válido");
      setIsLoading(false);
      return;
    }
    fetchQuestions();
  }, [idEmprendedor]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDestinatario]);

  useEffect(() => {
    if (questions.length > 0) {
      const grouped = questions.reduce((acc, question) => {
        if (!acc[question.destinatario]) {
          acc[question.destinatario] = [];
        }
        acc[question.destinatario].push(question);
        return acc;
      }, {});

      setGroupedQuestions(grouped);
      setCurrentDestinatario(Object.keys(grouped)[0]);
    }
  }, [questions]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7075/api/PreguntasIepm/detailed");
      if (!response.ok) {
        throw new Error("Error al obtener las preguntas");
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Ocultar la alerta cuando se responde una pregunta
    if (showUnansweredAlert) {
      setShowUnansweredAlert(false);
    }
  };

  const handleCommentChange = (questionId, comment) => {
    setComments(prev => ({
      ...prev,
      [questionId]: comment
    }));
  };

  const preparePayload = () => {
    if (!idEmprendedor) {
      throw new Error("idEmprendedor es requerido");
    }

    return Object.entries(answers).map(([idPregunta, valor]) => ({
      idPregunta: parseInt(idPregunta),
      valor: valor,
      comentarios: comments[idPregunta] || null,
      idEmprendedor: parseInt(idEmprendedor, 10)
    }));
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!idEmprendedor) {
        throw new Error("No se ha proporcionado un ID de emprendedor válido");
      }

      const payload = preparePayload();
      console.log("Enviando payload:", payload);

      const response = await fetch("https://localhost:7075/api/RespuestasIepm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkAllQuestionsAnswered = () => {
    if (!currentDestinatario || !groupedQuestions[currentDestinatario]) return false;
    
    const currentQuestions = groupedQuestions[currentDestinatario];
    return currentQuestions.every(q => answers[q.idPregunta] !== undefined);
  };

  const handleNextDestinatario = () => {
    const allAnswered = checkAllQuestionsAnswered();
    
    if (!allAnswered) {
      setShowUnansweredAlert(true);
      return;
    }

    const destinatarios = Object.keys(groupedQuestions);
    const currentIndex = destinatarios.indexOf(currentDestinatario);
    
    if (currentIndex < destinatarios.length - 1) {
      setCurrentDestinatario(destinatarios[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const allAnswered = checkAllQuestionsAnswered();
    
    if (!allAnswered) {
      setShowUnansweredAlert(true);
      return;
    }
    
    try {
      await submitAnswers();
    } catch (error) {
      // El error ya está manejado en submitAnswers
    }
  };

  const handleReturnToSurveys = () => {
    navigate("/ventanaencuestas");
  };

  if (submitSuccess) {
    return (
      <div className="survey-box success-message">
        <h2>¡Encuesta completada con éxito!</h2>
        <p>Gracias por participar en la encuesta. Los resultados han sido procesados.</p>
        <button 
          onClick={handleReturnToSurveys}
          className="return-button"
        >
          Volver a Encuestas
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="survey-box">Cargando preguntas...</div>;
  }

  if (error) {
    return (
      <div className="survey-box error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="survey-box">No hay preguntas disponibles</div>;
  }

  if (!currentDestinatario) {
    return <div className="survey-box">No hay destinatarios definidos</div>;
  }

  const currentQuestions = groupedQuestions[currentDestinatario];
  const destinatarios = Object.keys(groupedQuestions);
  const currentIndex = destinatarios.indexOf(currentDestinatario);
  const isLastDestinatario = currentIndex === destinatarios.length - 1;
  const allAnswered = checkAllQuestionsAnswered();

  return (
    <div className="survey-box">
      <p className="survey-type">
        Tipo de encuesta: <strong>IEPM</strong>
      </p>

      <h2 className="destinatario-header">
      <p className="survy-type">
        ENCUESTA
      </p>
        Enfoque: <strong>{currentDestinatario}</strong>
      </h2>

      {showUnansweredAlert && (
        <div className="alert-message">
          <p>Por favor responda todas las preguntas de esta sección antes de continuar.</p>
          <button onClick={() => setShowUnansweredAlert(false)}>Entendido</button>
        </div>
      )}

      <div className="progress-indicator">
        Sección: {currentIndex + 1} de {destinatarios.length}
      </div>

      <div className="questions-container">
        {currentQuestions.map((question) => (
          <div key={question.idPregunta} className="question-container">
            <p className="question-text">
              {question.enunciado}
            </p>
            
            <p className="question-indicator">
              <small>Indicador: {question.indicador}</small>
            </p>

            <div className="answers-container">
              {question.criteriosEvaluacion.map((criterio) => (
                <div
                  key={criterio.idCriterio}
                  onClick={() => handleAnswerChange(question.idPregunta, criterio.valor)}
                  className={`answer-option ${
                    answers[question.idPregunta] === criterio.valor ? "selected" : ""
                  }`}
                >
                  <div className="answer-value">{criterio.valor}</div>
                  <div className="answer-description">{criterio.descripcion}</div>
                </div>
              ))}
            </div>

            <div className="comment-section">
              <label htmlFor={`comment-${question.idPregunta}`}>Comentarios (opcional):</label>
              <textarea
                id={`comment-${question.idPregunta}`}
                className="comment-input"
                value={comments[question.idPregunta] || ""}
                onChange={(e) => handleCommentChange(question.idPregunta, e.target.value)}
                placeholder="Agregue algún comentario si lo desea"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        {currentIndex > 0 && (
          <button 
            onClick={() => setCurrentDestinatario(destinatarios[currentIndex - 1])}
            className="prev-button"
          >
            Anterior sección
          </button>
        )}

        <button 
          onClick={handleNextDestinatario} 
          className={`next-button ${!allAnswered ? 'disabled' : ''}`}
          disabled={isSubmitting || !allAnswered}
        >
          {isSubmitting ? "Procesando..." : 
            isLastDestinatario 
              ? "Finalizar encuesta" 
              : "Siguiente destinatario"}
        </button>
      </div>
    </div>
  );
};

export default IepmSurvey;