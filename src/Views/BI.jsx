import React, { useEffect, useState } from 'react';
import { 
  BarChart, PieChart, Bar, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import axios from 'axios';
import './BI.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

const BI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7075/api/EstadisticasEmprendedores');
        setData(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="bi-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="loading">Cargando datos...</div>
      </main>
    </div>
  );

  if (error) return (
    <div className="bi-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="error">Error: {error}</div>
      </main>
    </div>
  );

  if (!data) return (
    <div className="bi-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="error">No hay datos disponibles</div>
      </main>
    </div>
  );

  return (
    <div className="bi-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">DASHBOARD EMPRENDEDORES</h1>
        
        {/* KPI */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Emprendedores</h3>
            <div className="kpi-value">{data.kpis.totalEmprendedores}</div>
          </div>
          <div className="kpi-card">
            <h3>Total Empleados</h3>
            <div className="kpi-value">{data.kpis.totalEmpleados}</div>
          </div>
          <div className="kpi-card">
            <h3>Promedio Sueldos</h3>
            <div className="kpi-value">${data.kpis.promedioSueldos.toLocaleString()}</div>
          </div>
          <div className="kpi-card">
            <h3>Edad Promedio</h3>
            <div className="kpi-value">{data.kpis.promedioEdad} años</div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="dashboard-grid">
          {/* Distribución por edades */}
          <div className="chart-card">
            <h3>Distribución por Edades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.graficos.distribucionEdades}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Emprendedores" fill="#8884d8">
                  {data.graficos.distribucionEdades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Nivel de estudio */}
          <div className="chart-card">
            <h3>Nivel de Estudio</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.graficos.distribucionNivelEstudio}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.graficos.distribucionNivelEstudio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Relación de dependencia */}
          <div className="chart-card">
            <h3>Relación Laboral</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.graficos.relacionDependencia}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.graficos.relacionDependencia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución por tipo de empresa */}
          <div className="chart-card">
            <h3>Tipo de Empresa</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={data.graficos.distribucionTipoEmpresa}
                layout="vertical"
                margin={{ left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Emprendedores" fill="#8884d8">
                  {data.graficos.distribucionTipoEmpresa.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Empleados por género */}
          <div className="chart-card">
            <h3>Empleados por Género</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.graficos.empleadosPorGenero}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Empleados" fill="#8884d8">
                  <Cell fill="#0088FE" />
                  <Cell fill="#FF8042" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Evolución anual */}
          <div className="chart-card full-width">
            <h3>Evolución Anual</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data.graficos.evolucionAnual}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="anio" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="emprendedores" name="Emprendedores" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="empleados" name="Empleados" fill="#82ca9d" />
                <Bar yAxisId="right" dataKey="sueldoPromedio" name="Sueldo Promedio" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BI;