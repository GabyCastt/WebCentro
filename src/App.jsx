import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importa react-router-dom
import "./App.css";
import Header from "./components/Header/Header";
import Menu from "./components/Side-bar/Sidebar";
import HistoricoEmp from "./Views/HistoricoEmp"; // Importa el componente HistoricoEmp

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Menu />} />

          {/* Ruta para el componente HistoricoEmp */}
          <Route path="/historico" element={<HistoricoEmp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
