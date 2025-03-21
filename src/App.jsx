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
import Encuesta from "./Views/Encuesta.jsx";
import RegistrarRol from "./Views/RegistrarRol";
import Resultados from "./Views/Resultados";


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
                <button>Login</button>
              </Link>
            </div>
          )}

          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/RegistrarRol" element={<RegistrarRol setUser={setUser} />} />

            <Route path="/" element={<PrivateRoute user={user} />}>
              <Route path="/" element={<Menu />} />
              <Route path="/INICIO" element={<App />} />
              <Route path="/historico" element={<HistoricoEmp />} />
              <Route path="/detalles/:idEmprendedor" element={<DetallesEmp />} />
              <Route path="/detalles/:idEmprendedor/encuesta" element={<Encuesta />}/>
              <Route path="/encuesta" element={<Encuesta />} />
              <Route path="/resultados" element={<Resultados />} />
              <Route path="/registroemp" element={<RegistroEmp />} />
              <Route path="/emprendedor/:idEmprendedor" element={<DetallesEmp />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
