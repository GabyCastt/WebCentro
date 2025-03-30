import React, { useState, useEffect } from "react";
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

  // Efecto para cargar las encuestas disponibles
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

        // Adaptamos el formato [1, 2] a objetos con idEncuesta
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
        console.error("Error al cargar encuestas:", err);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Error al cargar encuestas: ${err.message}`,
        }));
      }
    };

    fetchEncuestas();
  }, [idEmprendedor]);

  // Efecto para cargar resultados cuando se selecciona una encuesta
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

        // Asegurarnos de que siempre trabajamos con un array
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
        console.error("Error al cargar datos:", err);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Error al cargar datos: ${err.message}`,
        }));
      }
    };

    fetchData();
  }, [idEmprendedor, encuestaSeleccionada]);

  // Función para cargar los resultados IEPM
  const fetchIEPMData = async () => {
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
      setStatus((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      console.error("Error al cargar resultados IEPM:", error);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error al cargar IEPM: ${error.message}`,
      }));
    }
  };

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

  if (encuestas.length === 0) {
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
      <Header />
      <div className="results-layout">
        <Sidebar />
        <div className="results-box">
          <h2>RESULTADOS FINALES</h2>

          {/* Selector de encuestas */}
          <div className="encuesta-selector">
            <label htmlFor="select-encuesta">Seleccione una encuesta: </label>
            <select
              id="select-encuesta"
              value={encuestaSeleccionada || ""}
              onChange={(e) =>
                setEncuestaSeleccionada(parseInt(e.target.value))
              }
              disabled={status.loading}
            >
              {encuestas.map((encuesta) => (
                <option key={encuesta.idEncuesta} value={encuesta.idEncuesta}>
                  Encuesta ID: {encuesta.idEncuesta}
                </option>
              ))}
            </select>
          </div>

          {/* Información del emprendedor */}
          <div className="results-info">
            <p>
              Emprendedor:{" "}
              <span className="data-box">
                {emprendedor ? emprendedor.nombre : "N/A"}
              </span>
            </p>
            <p>
              Encuesta seleccionada:{" "}
              <span className="data-box">{encuestaSeleccionada || "N/A"}</span>
            </p>
          </div>
          {/* Resultados por dimensión */}
          <h3>CÁLCULO ICE POR DIMENSIÓN:</h3>
          <div className="ice-dimensions">
            {competenciasNombres.map((nombre, index) => (
              <p key={index}>
                {nombre} →{" "}
                <span className="data-box">
                  {getValorCompetencia(index + 1)}
                </span>
              </p>
            ))}
          </div>

          {/* Gráfico de pastel */}
          <div className="pie-chart-container">
            <h4>VALORACIÓN ICE</h4>
            {activeTooltip && (
              <div className="custom-tooltip">
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
                      className="pie-slice"
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

              <div className="pie-legend">
                {resultados.map((resultado, index) => {
                  const percentage =
                    (resultado.puntuacionCompetencia / calcularIceGeneral()) *
                    100;

                  return (
                    <div key={resultado.idCompetencia} className="legend-item">
                      <span
                        className="legend-color"
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
          {/* Botón para mostrar resultados IEPM */}
          <div className="iepm-button-container">
            <button
              onClick={fetchIEPMData}
              className="iepm-button"
              disabled={status.loading}
            >
              {showIEPM ? "Ocultar IEPM" : "Mostrar Resultados IEPM"}
            </button>
          </div>
          {/* Sección de resultados IEPM */}
          {showIEPM && iepmData && (
            <div className="iepm-results-section">
              <h3>RESULTADOS IEPM</h3>

              {/* Por dimensión */}
              <div className="iepm-dimensions">
                <h4>Por Dimensión</h4>
                <div className="dimensions-grid">
                  {iepmData.porDimension.map((dimension, index) => (
                    <div key={index} className="dimension-card">
                      <h5>{dimension.dimension}</h5>
                      <p>
                        <strong>Puntaje:</strong> {dimension.puntaje.toFixed(2)}
                      </p>
                      <p>
                        <strong>Porcentaje:</strong>{" "}
                        {dimension.porcentaje.toFixed(2)}%
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
                    {iepmData.porIndicador.map((indicador, index) => (
                      <tr key={index}>
                        <td>{indicador.indicador}</td>
                        <td>{indicador.dimension}</td>
                        <td>{indicador.puntaje.toFixed(2)}</td>
                        <td>{indicador.porcentaje.toFixed(2)}%</td>
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
                    {iepmData.accionRecomendada.descripcion}
                  </p>
                  <p>
                    <strong>Recomendaciones:</strong>{" "}
                    {iepmData.accionRecomendada.recomendaciones}
                  </p>
                  <p>
                    <strong>Rango:</strong> {iepmData.accionRecomendada.rango}
                  </p>
                </div>
              </div>
            </div>
          )}
       {/* Resultado general */}
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
      <td>{calcularIceGeneral().toFixed(2)}</td>
      <td>{iceGeneralInfo.nivel}</td>
      <td>{iceGeneralInfo.acciones}</td>
    </tr>
    {iepmData && (
      <tr>
        <td>IEPM Total</td>
        <td>{iepmData.resultadoTotal.puntaje.toFixed(2)}</td>
        <td>{iepmData.resultadoTotal.valoracion}</td>
        <td>{iepmData.accionRecomendada.recomendaciones}</td>
      </tr>
    )}
  </tbody>
</table>
          
          {/* Botones de acción */}
          <div className="buttons">
            <button onClick={() => window.print()} className="print-button">
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
