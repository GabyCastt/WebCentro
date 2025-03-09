import React from 'react';
import './DetallesEmp.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

function DetallesEmp() {
  const emprendedor = {
    nombre: 'MIN YOON-GI',
    edad: '19-35 AÑOS',
    nivelEstudio: 'SUPERIOR',
    sueldo: '1000-1500',
    ruc: '2315202360001',
    empleadosHombres: 7,
    empleadosMujeres: 5
  };

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <main className="detalles-container">
        <h1>DETALLES EMPRENDEDOR</h1>
        <div className="info-box">
          <h2>INFORMACIÓN</h2>
          <table className="details-table">
            <tbody>
              <tr><td>NOMBRES Y APELLIDOS:</td><td>{emprendedor.nombre}</td></tr>
              <tr><td>RANGO DE EDAD:</td><td>{emprendedor.edad}</td></tr>
              <tr><td>NIVEL DE ESTUDIO:</td><td>{emprendedor.nivelEstudio}</td></tr>
              <tr><td>RANGO DE SUELDO:</td><td>{emprendedor.sueldo}</td></tr>
              <tr><td>TRABAJO RUC:</td><td>{emprendedor.ruc}</td></tr>
              <tr><td>EMPLEADOS HOMBRES:</td><td>{emprendedor.empleadosHombres} EMPLEADOS HOMBRES</td></tr>
              <tr><td>EMPLEADOS MUJERES:</td><td>{emprendedor.empleadosMujeres} EMPLEADAS MUJERES</td></tr>
            </tbody>
          </table>
          
        </div>
        <div className="button-group">
            <button className="edit-btn">EDITAR</button>
            <button className="report-btn">Generar Reporte</button>
            <button className="survey-btn">Agregar Resultado Encuesta</button>
          </div>
      </main>
    </div>
  );
}

export default DetallesEmp;
