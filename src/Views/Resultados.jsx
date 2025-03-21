import React from "react";
import "./Resultados.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import { useNavigate } from "react-router-dom";

const Resultados = () => {
  const navigate = useNavigate();

  return (
    <div className="results-container">
      <Header />
      <div className="results-layout">
        <Sidebar />
        <div className="results-box">
          <h2>RESULTADOS FINALES</h2>
          <div className="results-info">
            <p>Emprendimiento: <span className="data-box">[Nombre]</span></p>
            <p>Fecha: <span className="data-box">[Fecha]</span></p>
          </div>

          <h3>CÁLCULO ICE POR DIMENSIÓN:</h3>
          <div className="ice-dimensions">
            <p>Comportamiento emprendedor → <span className="data-box">[Valor]</span></p>
            <p>Creatividad → <span className="data-box">[Valor]</span></p>
            <p>Liderazgo → <span className="data-box">[Valor]</span></p>
            <p>Personalidad Proactiva → <span className="data-box">[Valor]</span></p>
            <p>Tolerancia a la incertidumbre → <span className="data-box">[Valor]</span></p>
            <p>Trabajo en Equipo → <span className="data-box">[Valor]</span></p>
            <p>Pensamiento Estratégico → <span className="data-box">[Valor]</span></p>
            <p>Proyección Social → <span className="data-box">[Valor]</span></p>
            <p>Orientación Financiera → <span className="data-box">[Valor]</span></p>
            <p>Orientación Tecnológica e Innovación → <span className="data-box">[Valor]</span></p>
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
                <td>[Valor]</td>
                <td>-</td>
              </tr>
              <tr>
                <td>IEPM</td>
                <td>[Valor]</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          {/* Gráfico de ICE General */}
          <div className="ice-general-chart">
            <h4>VALORES ICE</h4>
            <div className="bar-chart">
              <div className="bar" style={{ height: "40%", backgroundColor: "#C14600" }}></div>
              <div className="bar" style={{ height: "70%", backgroundColor: "#D98324" }}></div>
              <div className="bar" style={{ height: "50%", backgroundColor: "#D39D55" }}></div>
              <div className="bar" style={{ height: "90%", backgroundColor: "#FFB22C" }}></div>
              <div className="bar" style={{ height: "40%", backgroundColor: "#EB5A3C" }}></div>
              <div className="bar" style={{ height: "70%", backgroundColor: "#D39D55" }}></div>
              <div className="bar" style={{ height: "50%", backgroundColor: "#FCF596" }}></div>
              <div className="bar" style={{ height: "90%", backgroundColor: "#A04747" }}></div>
              <div className="bar" style={{ height: "40%", backgroundColor: "#C08B5C" }}></div>            
              <div className="bar" style={{ height: "50%", backgroundColor: "#854836" }}></div>
            </div>
          </div>

          {/* Gráfico de IEPM (3D Bars) */}
          <div className="iepm-chart">
            <h4>VALORES IEPM</h4>
            <div className="bar-chart-3d">
              <div className="bar-3d" style={{ height: "60%", backgroundColor: "#3D0301" }}></div>
              <div className="bar-3d" style={{ height: "80%", backgroundColor: "#C68EFD" }}></div>
              <div className="bar-3d" style={{ height: "40%", backgroundColor: "#E9A5F1" }}></div>
              <div className="bar-3d" style={{ height: "70%", backgroundColor: "#FED2E2" }}></div>
              <div className="bar-3d" style={{ height: "60%", backgroundColor: "#D76C82" }}></div>
              <div className="bar-3d" style={{ height: "80%", backgroundColor: "#8F87F1" }}></div>
              <div className="bar-3d" style={{ height: "40%", backgroundColor: "#B03052" }}></div>
              <div className="bar-3d" style={{ height: "70%", backgroundColor: "#BE5985" }}></div>
              <div className="bar-3d" style={{ height: "30%", backgroundColor: "#FFB8E0" }}></div>
            </div>
          </div>

          <div className="buttons">
            <button onClick={() => alert("Comentario agregado")} className="comment-button">Agregar Comentario</button>
            <button onClick={() => window.print()} className="print-button">Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultados;