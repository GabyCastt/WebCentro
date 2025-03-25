import React from "react";
import "./Home.css";
import Sidebar from "../components/Side-bar/Sidebar";
import LogoCentro from "../assets/LogoCentro.jpg";
import grupo1 from "../assets/grupo1.jpg";
import grupo2 from "../assets/grupo2.jpg";
import grupo3 from "../assets/grupo3.jpg";
import personas2 from "../assets/personas2.jpg";

const Home = () => {
  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="home-content">
        {/* Encabezado Institucional */}
        <header className="institutional-header">
          <div className="logo-title-container">
            <img src={LogoCentro} alt="Logo CIEMI UNIANDES" className="institutional-logo" />
            <div>
              <h1 className="institutional-title">CIEMI UNIANDES</h1>
              <p className="institutional-subtitle">Centro de Investigación en Emprendimiento e Innovación</p>
            </div>
          </div>
        </header>

        {/* Sección del Equipo Fundador */}
        <section className="founders-section">
          <h2 className="section-title">Nuestro Equipo Fundador</h2>
          <p className="section-description">
            Las personas visionarias que hicieron posible la creación de este centro
          </p>
          
          <div className="founders-grid">
            <div className="founder-card">
              <img src={grupo1} alt="Miembro fundador 1" className="founder-image" />
              <div className="founder-info">
                <h3>Nombre Apellido</h3>
                <p>Rol/Función</p>
              </div>
            </div>
            
            <div className="founder-card">
              <img src={grupo2} alt="Miembro fundador 2" className="founder-image" />
              <div className="founder-info">
                <h3>Nombre Apellido</h3>
                <p>Rol/Función</p>
              </div>
            </div>
            
            <div className="founder-card">
              <img src={grupo3} alt="Miembro fundador 3" className="founder-image" />
              <div className="founder-info">
                <h3>Nombre Apellido</h3>
                <p>Rol/Función</p>
              </div>
            </div>
            
            <div className="founder-card">
              <img src={personas2} alt="Miembro fundador 4" className="founder-image" />
              <div className="founder-info">
                <h3>Nombre Apellido</h3>
                <p>Rol/Función</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mensaje de bienvenida */}
        <section className="welcome-section">
          <h2 className="section-title">Bienvenido al Sistema de Evaluación</h2>
          <p className="welcome-text">
            Herramienta creada para evaluar el potencial emprendedor mediante metodologías validadas
            por nuestro equipo de investigación.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;