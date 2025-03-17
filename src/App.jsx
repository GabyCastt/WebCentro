import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importa react-router-dom
import "./App.css";
import Header from "./components/Header/Header";
import Menu from "./components/Side-bar/Sidebar";
import HistoricoEmp from "./Views/HistoricoEmp"; // Importa el componente HistoricoEmp
import DetallesEmp from './Views/DetallesEmp';
import RegistroEmp from "./Views/RegistroEmp";

function App() {
  return (
    <Router>
<div class="loader">
  <div class="container">
    <div class="carousel">
      <div class="love"></div>
      <div class="love"></div>
      <div class="love"></div>
      <div class="love"></div>
      <div class="love"></div>
      <div class="love"></div>
      <div class="love"></div>
    </div>
  </div>
  <div class="container">
    <div class="carousel">
      <div class="death"></div>
      <div class="death"></div>
      <div class="death"></div>
      <div class="death"></div>
      <div class="death"></div>
      <div class="death"></div>
      <div class="death"></div>
    </div>
  </div>
  <div class="container">
    <div class="carousel">
      <div class="robots"></div>
      <div class="robots"></div>
      <div class="robots"></div>
      <div class="robots"></div>
      <div class="robots"></div>
      <div class="robots"></div>
      <div class="robots"></div>
    </div>
  </div>
</div>

      <div className="App">
        <Header />
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Menu />} />

          {/* Ruta para el componente HistoricoEmp */}
          <Route path="/INICIO" element={<App />} />
          <Route path="/historico" element={<HistoricoEmp />} />
          <Route path="/detalles/:idEmprendedor" element={<DetallesEmp />} />  
          <Route path="/registroemp" element={<RegistroEmp />} />      
          </Routes>
      </div>
    </Router>
  );
}

export default App;
