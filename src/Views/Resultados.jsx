import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import "./Resultados.css";

const Resultados = () => {
  const { idEmprendedor } = useParams();
  const [resultados, setResultados] = useState([]);
  const [emprendedor, setEmprendedor] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    loadedEncuestas: false,
    loadedResultados: false,
  });
  const [iepmData, setIepmData] = useState(null);
  const [showIEPM, setShowIEPM] = useState(false);
  const [encuestasIEPM, setEncuestasIEPM] = useState([]);
  const [encuestaSeleccionadaIEPM, setEncuestaSeleccionadaIEPM] =
    useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [comentarios, setComentarios] = useState("");
  const [showComentarios, setShowComentarios] = useState(false);
  const [comentariosSeleccionados, setComentariosSeleccionados] = useState([]);
  const [showSideComments, setShowSideComments] = useState(false);
  const printRef = useRef();

  // Comentarios predefinidos actualizados
  const comentariosPredefinidos = {
    Capacitación: [
      "Capacitación en programas de formación empresarial - Desarrollo de competencias en gestión y administración",
      "Capacitación en dirección estratégica - Enfoque en toma de decisiones y liderazgo organizacional",
      "Capacitación en comercialización - Estrategias de mercado y ventas",
      "Capacitación de personal calificado - Desarrollo de competencias técnicas y profesionales",
    ],
    Herramientas: [
      "Herramientas económicas y financieras - Análisis financiero y gestión de recursos",
      "Herramientas de tecnología e innovación - Aplicación de tecnologías emergentes en negocios",
    ],
    Evaluación: [
      "Evaluación del marco legal - Análisis de normativas y regulaciones para su cumplimiento",
      "Identificación de deficiencias en servicios municipales - Trabajo con gas municipales y ministerios para mejorar servicios públicos",
      "Revisión de la matriz productiva del país y la región - Evaluación de sectores estratégicos para el desarrollo",
      "Identificación de necesidades para la viabilidad técnica de negocios - Evaluación de oportunidades y riesgos",
    ],
    Otros: [
      "Tolerancia a la incertidumbre y proyección social - Factores clave en la toma de decisiones",
      "Revisión y adquisición de información sobre fuentes de financiamiento - Análisis de alternativas económicas",
      "Estudio del territorio para abastecimiento y localización de instalaciones - Planificación logística y operativa",
      "Clasificación según nivel de puesta en marcha - Segmentación en baja, media, mediana y alta para la planificación estratégica",
    ],
  };

  // Cargar comentarios guardados al iniciar
  useEffect(() => {
    const savedComentarios = localStorage.getItem(
      `comentarios_${idEmprendedor}`
    );
    if (savedComentarios) {
      setComentarios(savedComentarios);
      // Extraer comentarios seleccionados del texto guardado
      const comentariosArray = savedComentarios
        .split("\n")
        .filter((line) => line.startsWith("- "))
        .map((line) => line.substring(2));
      setComentariosSeleccionados(comentariosArray);
    }
  }, [idEmprendedor]);

  // Efecto para controlar la visibilidad del sidebar
  useEffect(() => {
    if (!showSidebar) {
      document.body.classList.add("hide-sidebar");
    } else {
      document.body.classList.remove("hide-sidebar");
    }

    return () => {
      document.body.classList.remove("hide-sidebar");
    };
  }, [showSidebar]);

  // Efecto para cargar las encuestas disponibles ICE
  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        setStatus((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(
          `https://localhost:7075/api/Encuesta/encuestas/${idEmprendedor}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();

        const encuestasFormateadas = Array.isArray(data)
          ? data.map((id) => ({ idEncuesta: id }))
          : [];

        setEncuestas(encuestasFormateadas);
        setStatus((prev) => ({ ...prev, loadedEncuestas: true }));

        if (encuestasFormateadas.length > 0) {
          setEncuestaSeleccionada(encuestasFormateadas[0].idEncuesta);
        } else {
          setStatus((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error("Error al cargar encuestas ICE:", err);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Error al cargar encuestas ICE: ${err.message}`,
        }));
      }
    };

    fetchEncuestas();
  }, [idEmprendedor]);

  // Efecto para cargar las encuestas disponibles IEPM
  useEffect(() => {
    const fetchEncuestasIEPM = async () => {
      try {
        setStatus((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(
          `https://localhost:7075/api/IepmCalculation/Encuestas/${idEmprendedor}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        setEncuestasIEPM(data);

        if (data.length > 0) {
          setEncuestaSeleccionadaIEPM(data[0].idEncuesta);
        }
      } catch (err) {
        console.error("Error al cargar encuestas IEPM:", err);
        setStatus((prev) => ({
          ...prev,
          error: `Error al cargar encuestas IEPM: ${err.message}`,
        }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchEncuestasIEPM();
  }, [idEmprendedor]);

  // Efecto para cargar resultados ICE cuando se selecciona una encuesta
  useEffect(() => {
    const fetchData = async () => {
      if (!encuestaSeleccionada) return;

      try {
        setStatus((prev) => ({ ...prev, loading: true, error: null }));

        // Obtener datos del emprendedor
        const emprendedorRes = await fetch(
          `https://localhost:7075/api/Emprendedores/${idEmprendedor}`
        );
        if (!emprendedorRes.ok) throw new Error("Error al cargar emprendedor");
        setEmprendedor(await emprendedorRes.json());

        // Obtener resultados de la encuesta seleccionada
        const resultadosRes = await fetch(
          `https://localhost:7075/api/Encuesta/resultados-resumen/${idEmprendedor}/${encuestaSeleccionada}`
        );
        if (!resultadosRes.ok) throw new Error("Error al cargar resultados");

        const resultadosData = await resultadosRes.json();

        const resultadosArray = Array.isArray(resultadosData)
          ? resultadosData
          : resultadosData.resultados || resultadosData.data || [];

        setResultados(resultadosArray);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          loadedResultados: true,
          error: null,
        }));
      } catch (err) {
        console.error("Error al cargar datos ICE:", err);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Error al cargar datos ICE: ${err.message}`,
        }));
      }
    };

    fetchData();
  }, [idEmprendedor, encuestaSeleccionada]);

  // Efecto para cargar resultados IEPM cuando se selecciona una encuesta
  useEffect(() => {
    const fetchIEPMData = async () => {
      if (!encuestaSeleccionadaIEPM) return;

      try {
        setStatus((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(
          `https://localhost:7075/api/PreguntasIepm/ResultadosCompletos/${idEmprendedor}`
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        setIepmData(data);
        setShowIEPM(true);
      } catch (error) {
        console.error("Error al cargar resultados IEPM:", error);
        setStatus((prev) => ({
          ...prev,
          error: `Error al cargar IEPM: ${error.message}`,
        }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchIEPMData();
  }, [idEmprendedor, encuestaSeleccionadaIEPM]);

  // Función para obtener el valor de una competencia específica
  const getValorCompetencia = (idCompetencia) => {
    if (!resultados || resultados.length === 0) return "N/A";
    const resultado = resultados.find((r) => r.idCompetencia === idCompetencia);
    return resultado
      ? resultado.puntuacionCompetencia?.toFixed(2) || "0.00"
      : "N/A";
  };

  // Función para calcular el ICE General
  const calcularIceGeneral = () => {
    if (!resultados || resultados.length === 0) return 0;
    const total = resultados.reduce(
      (sum, r) => sum + (r.puntuacionCompetencia || 0),
      0
    );
    return total;
  };

  // Función para determinar el nivel según el ICE General
  const getNivelIceGeneral = () => {
    const iceGeneral = calcularIceGeneral();
    if (iceGeneral >= 0 && iceGeneral < 0.6) {
      return {
        nivel: "Bajo",
        valoracion: "Baja competencia emprendedora",
        acciones: "Falta desarrollar las competencias",
      };
    } else if (iceGeneral >= 0.6 && iceGeneral < 0.8) {
      return {
        nivel: "Medio",
        valoracion: "Mediana competencia",
        acciones: "Se cumple con las competencias básicas",
      };
    } else if (iceGeneral >= 0.8 && iceGeneral <= 1) {
      return {
        nivel: "Alto",
        valoracion: "Alta competencia",
        acciones: "Excelente desempeño en competencias",
      };
    } else {
      return {
        nivel: "N/A",
        valoracion: "N/A",
        acciones: "N/A",
      };
    }
  };

  // Función para manejar la impresión
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Resultados_${
      emprendedor?.nombre || "Emprendedor"
    }_${new Date().toLocaleDateString()}`;

    // Ocultar elementos - usa selectores más específicos
    const header = document.querySelector("header, .header, .header-container");
    const sidebar = document.querySelector(".sidebar, .sidebar-container");

    if (header) {
      header.style.visibility = "hidden";
      header.style.position = "absolute"; // Para que no ocupe espacio
    }

    if (sidebar) {
      sidebar.style.visibility = "hidden";
      sidebar.style.position = "absolute";
    }

    // Forzar colores en impresión
    document.querySelectorAll(".pie-slice").forEach((slice) => {
      slice.style.webkitPrintColorAdjust = "exact";
      slice.style.printColorAdjust = "exact";
    });

    setTimeout(() => {
      window.print();

      // Restaurar después de imprimir
      setTimeout(() => {
        document.title = originalTitle;
        if (header) {
          header.style.visibility = "";
          header.style.position = "";
        }
        if (sidebar) {
          sidebar.style.visibility = "";
          sidebar.style.position = "";
        }
      }, 500);
    }, 500);
  };

  // Función para añadir un comentario seleccionado
  const agregarComentario = (comentario) => {
    // Si ya está seleccionado, no lo añadimos de nuevo
    if (!comentariosSeleccionados.includes(comentario)) {
      setComentariosSeleccionados([...comentariosSeleccionados, comentario]);

      // También lo añadimos al textarea
      const nuevoComentario = comentarios
        ? `${comentarios}\n- ${comentario}`
        : `- ${comentario}`;
      setComentarios(nuevoComentario);
    }
  };

  // Función para eliminar un comentario seleccionado
  const eliminarComentario = (index) => {
    const nuevosComentarios = [...comentariosSeleccionados];
    nuevosComentarios.splice(index, 1);
    setComentariosSeleccionados(nuevosComentarios);

    // Actualizar también el textarea
    setComentarios(nuevosComentarios.map((c) => `- ${c}`).join("\n"));
  };

  // Función para guardar comentarios
  const guardarComentarios = () => {
    localStorage.setItem(`comentarios_${idEmprendedor}`, comentarios);
    setShowComentarios(false);
    setShowSideComments(false);
  };

  if (status.error) {
    return (
      <div className="results-container">
        <Header />
        <div className="error-message">
          <h3>Error</h3>
          <p>{status.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (status.loading) {
    return (
      <div className="results-container">
        <Header />
        <div className="loading">
          <p>Cargando datos...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (encuestas.length === 0 && encuestasIEPM.length === 0) {
    return (
      <div className="results-container">
        <Header />
        <div className="no-encuestas">
          <h3>No hay encuestas disponibles</h3>
          <p>Este emprendedor no tiene encuestas registradas.</p>
        </div>
      </div>
    );
  }

  const iceGeneralInfo = getNivelIceGeneral();
  const competenciasNombres = [
    "Comportamiento Emprendedor",
    "Creatividad",
    "Liderazgo",
    "Personalidad Proactiva",
    "Tolerancia a la incertidumbre",
    "Trabajo en Equipo",
    "Pensamiento Estratégico",
    "Proyección Social",
    "Orientación Financiera",
    "Orientación Tecnológica e innovación",
  ];
  const colors = [
    "#FF6E6E",
    "#D05AFF",
    "#6A8CFF",
    "#4DDBFF",
    "#7CFFCB",
    "#F4FF81",
    "#FFE066",
    "#FF9E66",
    "#FF7BAC",
    "#66FFA6",
  ];

  return (
    <div className="results-container">
      <Header className="no-print" />
      <div className="results-layout">
        {showSidebar && <Sidebar className="no-print" />}

        <div className="results-box" ref={printRef}>
          <h2>RESULTADOS FINALES</h2>

          {/* Información del emprendedor */}
          <div className="results-info print-header">
            <p>
              <strong>Emprendedor:</strong>{" "}
              <span className="data-box">
                {emprendedor ? emprendedor.nombre : "N/A"}
              </span>
            </p>
            <p>
              <strong>Fecha de generación:</strong>{" "}
              <span className="data-box">
                {new Date().toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* Selector de encuestas ICE */}
          <div className="encuesta-selector no-print">
            <label htmlFor="select-encuesta-ice">
              Seleccione la encuesta de ICE correspondiente:{" "}
            </label>
            <select
              id="select-encuesta-ice"
              value={encuestaSeleccionada || ""}
              onChange={(e) =>
                setEncuestaSeleccionada(parseInt(e.target.value))
              }
              disabled={status.loading}
            >
              {encuestas.map((encuesta) => (
                <option key={encuesta.idEncuesta} value={encuesta.idEncuesta}>
                  Número de encuesta y fecha de su aplicación:{" "}
                  {encuesta.idEncuesta}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de encuestas IEPM */}
          <div className="encuesta-selector no-print">
            <label htmlFor="select-encuesta-iepm">
              Seleccione la encuesta de IEPM correspondiente:{" "}
            </label>
            <select
              id="select-encuesta-iepm"
              value={encuestaSeleccionadaIEPM || ""}
              onChange={(e) =>
                setEncuestaSeleccionadaIEPM(parseInt(e.target.value))
              }
              disabled={status.loading}
            >
              {encuestasIEPM.map((encuesta) => (
                <option key={encuesta.idEncuesta} value={encuesta.idEncuesta}>
                  Número de encuesta y fecha de su aplicación:{" "}
                  {encuesta.idEncuesta} -{" "}
                  {new Date(encuesta.fechaAplicacion).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Información de encuestas seleccionadas */}
          <div className="print-only encuestas-info">
            <p>
              <strong>Encuesta ICE seleccionada:</strong>{" "}
              <span className="data-box">{encuestaSeleccionada || "N/A"}</span>
            </p>
            <p>
              <strong>Encuesta IEPM seleccionada:</strong>{" "}
              <span className="data-box">
                {encuestaSeleccionadaIEPM || "N/A"}
              </span>
            </p>
          </div>

          {/* Resultados por dimensión ICE */}
          <div className="results-section">
            <h3>CÁLCULO ICE POR COMPETENCIA:</h3>
            <div className="ice-dimensions">
              <div className="dimensions-column">
                {competenciasNombres.slice(0, 5).map((nombre, index) => (
                  <p key={index}>
                    {nombre} →{" "}
                    <span className="data-box">
                      {getValorCompetencia(index + 1)}
                    </span>
                  </p>
                ))}
              </div>
              <div className="dimensions-column">
                {competenciasNombres.slice(5).map((nombre, index) => (
                  <p key={index + 5}>
                    {nombre} →{" "}
                    <span className="data-box">
                      {getValorCompetencia(index + 6)}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico de pastel ICE con clases para impresión */}
          <div className="pie-chart-container print-pie-chart">
            <h4>VALORACIÓN ICE</h4>
            {activeTooltip && (
              <div className="custom-tooltip no-print">
                {activeTooltip.competencia}: {activeTooltip.percentage}%
              </div>
            )}
            <div className="pie-chart-wrapper">
              <div className="pie-chart">
                {resultados.map((resultado, index) => {
                  const percentage =
                    (resultado.puntuacionCompetencia / calcularIceGeneral()) *
                    100;
                  const offset = resultados.slice(0, index).reduce((acc, r) => {
                    return (
                      acc +
                      (r.puntuacionCompetencia / calcularIceGeneral()) * 360
                    );
                  }, 0);

                  return (
                    <div
                      key={resultado.idCompetencia}
                      className="pie-slice print-pie-slice"
                      style={{
                        backgroundColor: colors[index],
                        transform: `rotate(${offset}deg)`,
                        clipPath: `conic-gradient(${colors[index]} 0% ${percentage}%, transparent ${percentage}% 100%)`,
                      }}
                      onMouseEnter={() =>
                        setActiveTooltip({
                          competencia: competenciasNombres[index],
                          percentage: percentage.toFixed(1),
                        })
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    ></div>
                  );
                })}
              </div>

              <div className="pie-legend print-pie-legend">
                {resultados.map((resultado, index) => {
                  const percentage =
                    (resultado.puntuacionCompetencia / calcularIceGeneral()) *
                    100;

                  return (
                    <div key={resultado.idCompetencia} className="legend-item">
                      <span
                        className="legend-color print-legend-color"
                        style={{ backgroundColor: colors[index] }}
                      ></span>
                      <span className="legend-label">
                        {competenciasNombres[index]} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sección de resultados IEPM */}
          {showIEPM && iepmData && (
            <div className="iepm-results-section">
              <h3>RESULTADOS IEPM</h3>

              {/* Resultado total */}
              <div className="iepm-total">
                <h4>Resultado General</h4>
                <div className="total-card">
                  <p>
                    <strong>Puntaje:</strong>{" "}
                    {iepmData.resultadoTotal?.puntaje?.toFixed(3) || "N/A"}
                  </p>
                  <p>
                    <strong>Porcentaje:</strong>{" "}
                    {iepmData.resultadoTotal?.porcentaje?.toFixed(1) || "N/A"}%
                  </p>
                  <p>
                    <strong>Valoración:</strong>{" "}
                    {iepmData.resultadoTotal?.valoracion || "N/A"}
                  </p>
                  <p>
                    <strong>Criterio:</strong>{" "}
                    {iepmData.resultadoTotal?.criterio || "N/A"}
                  </p>
                </div>
              </div>

              {/* Por dimensión */}
              <div className="iepm-dimensions">
                <h4>Por Dimensión</h4>
                <div className="dimensions-grid">
                  {iepmData.porDimension?.map((dimension, index) => (
                    <div key={index} className="dimension-card">
                      <h5>{dimension.dimension}</h5>
                      <p>
                        <strong>Puntaje:</strong>{" "}
                        {dimension.puntaje?.toFixed(3) || "N/A"}
                      </p>
                      <p>
                        <strong>Porcentaje:</strong>{" "}
                        {dimension.porcentaje?.toFixed(1) || "N/A"}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por indicador */}
              <div className="iepm-indicators">
                <h4>Por Indicador</h4>
                <table className="indicators-table">
                  <thead>
                    <tr>
                      <th>Indicador</th>
                      <th>Dimensión</th>
                      <th>Puntaje</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iepmData.porIndicador?.map((indicador, index) => (
                      <tr key={index}>
                        <td>{indicador.indicador}</td>
                        <td>{indicador.dimension}</td>
                        <td>{indicador.puntaje?.toFixed(3) || "N/A"}</td>
                        <td>{indicador.porcentaje?.toFixed(1) || "N/A"}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Acciones recomendadas */}
              <div className="iepm-recommendations">
                <h4>Acciones Recomendadas</h4>
                <div className="recommendations-card">
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {iepmData.accionRecomendada?.descripcion || "N/A"}
                  </p>
                  <p>
                    <strong>Recomendaciones:</strong>{" "}
                    {iepmData.accionRecomendada?.recomendaciones || "N/A"}
                  </p>
                  <p>
                    <strong>Rango:</strong>{" "}
                    {iepmData.accionRecomendada?.rango || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Resultado general */}
          <div className="results-section">
            <h3>RESULTADO GENERAL</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>INDICADOR</th>
                  <th>VALOR</th>
                  <th>NIVEL</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ICE General</td>
                  <td>
                    {resultados.length > 0
                      ? `${calcularIceGeneral().toFixed(2)}/1`
                      : "N/A"}
                  </td>
                  <td>{iceGeneralInfo.nivel}</td>
                  <td>{iceGeneralInfo.acciones}</td>
                </tr>
                {iepmData && (
                  <tr>
                    <td>IEPM Total</td>
                    <td>
                      {iepmData.resultadoTotal?.puntaje
                        ? `${iepmData.resultadoTotal.puntaje.toFixed(3)}/1`
                        : "N/A"}
                    </td>
                    <td>{iepmData.resultadoTotal?.valoracion || "N/A"}</td>
                    <td>
                      {iepmData.accionRecomendada?.recomendaciones || "N/A"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sección de comentarios */}
          {showComentarios ? (
            <div className="comments-section">
              <h3>COMENTARIOS ADICIONALES</h3>

              <div className="comments-content">
                {/* Comentarios seleccionados */}
                {comentariosSeleccionados.length > 0 && (
                  <div className="selected-comments">
                    <h4>Comentarios Seleccionados:</h4>
                    <ul>
                      {comentariosSeleccionados.map((comentario, index) => (
                        <li key={index} className="selected-comment-item">
                          {comentario}
                          <button
                            onClick={() => eliminarComentario(index)}
                            className="remove-comment-button"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Escribe aquí tus comentarios adicionales o selecciona comentarios predefinidos..."
                  className="comments-textarea"
                />

                {/* Comentarios predefinidos */}
                {showSideComments && (
                  <div className="predefined-comments">
                    <h4>Comentarios Predefinidos</h4>
                    {Object.entries(comentariosPredefinidos).map(
                      ([categoria, comentariosCategoria]) => (
                        <div key={categoria} className="comment-category">
                          <h5>{categoria}</h5>
                          <ul>
                            {comentariosCategoria.map((comentario, idx) => (
                              <li
                                key={idx}
                                onClick={() => agregarComentario(comentario)}
                                className="comment-item"
                              >
                                {comentario}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="comments-buttons">
                <button onClick={guardarComentarios} className="save-button">
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowComentarios(false);
                    setShowSideComments(false);
                  }}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowSideComments(!showSideComments)}
                  className="toggle-comments-button"
                >
                  {showSideComments
                    ? "Ocultar Comentarios"
                    : "Mostrar Comentarios"}
                </button>
              </div>
            </div>
          ) : (
            <div className="comments-preview">
              {comentarios && (
                <div className="saved-comments">
                  <h3>COMENTARIOS ADICIONALES</h3>
                  <p>{comentarios}</p>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="buttons no-print">
            <button onClick={handlePrint} className="print-button">
              Imprimir
            </button>
            <button
              onClick={() => {
                setShowComentarios(true);
                setShowSideComments(true);
              }}
              className="comments-button"
            >
              {comentarios ? "Editar Comentarios" : "Agregar Comentarios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
