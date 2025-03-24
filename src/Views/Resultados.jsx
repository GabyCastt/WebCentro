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

  // Obtener los resultados de la API y los datos del emprendedor
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener resultados de la encuesta ICE
        const resultadosResponse = await fetch(`https://localhost:7075/api/ResultadosIce`);
        if (!resultadosResponse.ok) {
          throw new Error("Error al obtener los resultados");
        }
        const resultadosData = await resultadosResponse.json();
        const resultadosFiltrados = resultadosData.filter(
          (resultado) => resultado.idEmprendedor === parseInt(idEmprendedor, 10)
        );
        setResultados(resultadosFiltrados);

        // Obtener datos del emprendedor
        const emprendedorResponse = await fetch(`https://localhost:7075/api/Emprendedores/${idEmprendedor}`);
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
    const total = resultados.reduce((sum, r) => sum + r.puntuacionCompetencia, 0);
    return total.toFixed(2);
  };

  // Función para calcular el IEPM (se debe ajustar a lo que necesitemos)
  const calcularIepm = () => {

    return "N/A"; // Placeholder
  };

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
              Creatividad → <span className="data-box">{getValorCompetencia(2)}</span>
            </p>
            <p>
              Liderazgo → <span className="data-box">{getValorCompetencia(3)}</span>
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
                <td>-</td>
              </tr>
              <tr>
                <td>IEPM</td>
                <td>{calcularIepm()}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          {/* Gráfico de ICE General */}
          <div className="ice-general-chart">
            <h4>VALORES ICE</h4>
            <div className="bar-chart">
              {resultados.map((resultado) => (
                <div
                  key={resultado.idCompetencia}
                  className="bar"
                  style={{
                    height: `${resultado.puntuacionCompetencia * 100}%`,
                    backgroundColor: "#C14600",
                  }}
                ></div>
              ))}
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