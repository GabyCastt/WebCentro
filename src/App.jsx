import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Menu from "./components/Side-bar/Sidebar";
import HistoricoEmp from "./Views/HistoricoEmp";
import DetallesEmp from "./Views/DetallesEmp";
import RegistroEmp from "./Views/RegistroEmp";
import Login from "./Views/Login";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import EncuestaICE from "./Views/EncuestaICE.jsx";
import EncuestaIEPM from "./Views/EncuestaIEPM.jsx";
import VentanaEncuestas from "./Views/VentanaEncuestas.jsx";
import RegistrarRol from "./Views/RegistrarRol";
import Resultados from "./Views/Resultados";
import Home from "./Views/Home";
import ReporteriaRol from "./Views/ReporteriaRol.jsx";

function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          {!user && (
            <div className="login-button-container">
              <Link to="/login">
              <button className="login-btn">Login</button>
              </Link>
            </div>
          )}
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/RegistrarRol" element={<RegistrarRol setUser={setUser} />} />

            <Route path="/" element={<PrivateRoute user={user} />}>
              <Route path="/" element={<Home />} />
              <Route path="/INICIO" element={<Home />} />
              <Route path="/historico" element={<HistoricoEmp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/detalles/:idEmprendedor" element={<DetallesEmp />} />
              <Route path="/detalles/:idEmprendedor/ventanaencuestas" element={<VentanaEncuestas />} />
              <Route path="/detalles/:idEmprendedor/encuestaice" element={<EncuestaICE />}/>
              <Route path="/detalles/:idEmprendedor/encuestaiepm" element={<EncuestaIEPM />}/>
              <Route path="/detalles/:idEmprendedor/resultados" element={<Resultados />}/>
              <Route path="/encuestaice" element={<EncuestaICE />} />
              <Route path="/encuestaiepm" element={<EncuestaIEPM />} />
              <Route path="/resultados" element={<Resultados />} />
              <Route path="/registroemp" element={<RegistroEmp />} />
              <Route path="/emprendedor/:idEmprendedor" element={<DetallesEmp />} />
              <Route path="/ventanaencuestas" element={<VentanaEncuestas />} />
              <Route path="/reporteriarol" element={<ReporteriaRol />} /> </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;