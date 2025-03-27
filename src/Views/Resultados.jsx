import React, { useState, useEffect } from "react";
import "./Resultados.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import { useParams } from "react-router-dom";

const Resultados = () => {
  const { idEmprendedor } = useParams();
  const [resultados, setResultados] = useState([]);
  const [emprendedor, setEmprendedor] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Obtener los resultados de la API y los datos del emprendedor
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener resultados de la encuesta ICE
        const resultadosResponse = await fetch(
          `https://localhost:7075/api/ResultadosIce`
        );
        if (!resultadosResponse.ok) {
          throw new Error("Error al obtener los resultados");
        }
        const resultadosData = await resultadosResponse.json();
        const resultadosFiltrados = resultadosData.filter(
          (resultado) => resultado.idEmprendedor === parseInt(idEmprendedor, 10)
        );
        setResultados(resultadosFiltrados);

        // Obtener datos del emprendedor
        const emprendedorResponse = await fetch(
          `https://localhost:7075/api/Emprendedores/${idEmprendedor}`
        );
        if (!emprendedorResponse.ok) {
          throw new Error("Error al obtener los datos del emprendedor");
        }
        const emprendedorData = await emprendedorResponse.json();
        setEmprendedor(emprendedorData);
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEmprendedor]);

  // Función para obtener el valor de una competencia específica
  const getValorCompetencia = (idCompetencia) => {
    const resultado = resultados.find((r) => r.idCompetencia === idCompetencia);
    return resultado ? resultado.puntuacionCompetencia.toFixed(2) : "N/A";
  };

  // Función para calcular el ICE General (suma de todas las competencias)
  const calcularIceGeneral = () => {
    const total = resultados.reduce(
      (sum, r) => sum + r.puntuacionCompetencia,
      0
    );
    return total.toFixed(2);
  };

  // Función para determinar el nivel y acciones según el ICE General
  const getNivelIceGeneral = () => {
    const iceGeneral = parseFloat(calcularIceGeneral());
    if (iceGeneral >= 0 && iceGeneral < 0.6) {
      return {
        nivel: "Bajo",
        valoracion:
          "Baja competencia emprendedora, muy baja Mediana competencia",
        acciones: "Falta desarrollar las competencias",
      };
    } else if (iceGeneral >= 0.6 && iceGeneral < 0.8) {
      return {
        nivel: "Medio",
        valoracion: "Mediana competencia para Alta competencia",
        acciones: "Se cumple con las competencias",
      };
    } else if (iceGeneral >= 0.8 && iceGeneral <= 1) {
      return {
        nivel: "Alto",
        valoracion: "Alta competencia",
        acciones: "Se cumple con las competencias",
      };
    } else {
      return {
        nivel: "N/A",
        valoracion: "N/A",
        acciones: "N/A",
      };
    }
  };

  // Función para calcular el IEPM (se debe ajustar a lo que necesitemos)
  const calcularIepm = () => {
    return "N/A"; // Placeholder
  };
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Función para formatear la fecha actual
  const getFechaActual = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Cargando resultados...</div>;
  }

  const iceGeneralInfo = getNivelIceGeneral();

  return (
    <div className="results-container">
      <Header />
      <div className="results-layout">
        <Sidebar />
        <div className="results-box">
          <h2>RESULTADOS FINALES</h2>
          <div className="results-info">
            <p>
              Emprendedor:{" "}
              <span className="data-box">
                {emprendedor ? emprendedor.nombre : "Cargando..."}
              </span>
            </p>
            <p>
              Fecha: <span className="data-box">{getFechaActual()}</span>
            </p>
          </div>

          <h3>CÁLCULO ICE POR DIMENSIÓN:</h3>
          <div className="ice-dimensions">
            <p>
              Comportamiento emprendedor →{" "}
              <span className="data-box">{getValorCompetencia(1)}</span>
            </p>
            <p>
              Creatividad →{" "}
              <span className="data-box">{getValorCompetencia(2)}</span>
            </p>
            <p>
              Liderazgo →{" "}
              <span className="data-box">{getValorCompetencia(3)}</span>
            </p>
            <p>
              Personalidad Proactiva →{" "}
              <span className="data-box">{getValorCompetencia(4)}</span>
            </p>
            <p>
              Tolerancia a la incertidumbre →{" "}
              <span className="data-box">{getValorCompetencia(5)}</span>
            </p>
            <p>
              Trabajo en Equipo →{" "}
              <span className="data-box">{getValorCompetencia(6)}</span>
            </p>
            <p>
              Pensamiento Estratégico →{" "}
              <span className="data-box">{getValorCompetencia(7)}</span>
            </p>
            <p>
              Proyección Social →{" "}
              <span className="data-box">{getValorCompetencia(8)}</span>
            </p>
            <p>
              Orientación Financiera →{" "}
              <span className="data-box">{getValorCompetencia(9)}</span>
            </p>
            <p>
              Orientación Tecnológica e Innovación →{" "}
              <span className="data-box">{getValorCompetencia(10)}</span>
            </p>
          </div>

          <h3>RESULTADO GENERAL</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>NIVEL</th>
                <th>VALORACIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ICE General</td>
                <td>{calcularIceGeneral()}</td>
                <td>{iceGeneralInfo.acciones}</td>
              </tr>
              <tr>
                <td>IEPM</td>
                <td>{calcularIepm()}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

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
                  const competencias = [
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
                          competencia:
                            competencias[resultado.idCompetencia - 1],
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
                  const competencias = [
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
                        {competencias[index]} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gráfico de IEPM (3D Bars) */}
          <div className="iepm-chart">
            <h4>VALORES IEPM</h4>
            <div className="bar-chart-3d">
              {resultados.map((resultado) => (
                <div
                  key={resultado.idCompetencia}
                  className="bar-3d"
                  style={{
                    height: `${resultado.puntuacionCompetencia * 100}%`,
                    backgroundColor: "#3D0301",
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="buttons">
            <button
              onClick={() => alert("Comentario agregado")}
              className="comment-button"
            >
              Agregar Comentario
            </button>
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
