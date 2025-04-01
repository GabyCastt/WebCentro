import React, { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, 
  PieChart, 
  Bar, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import axios from 'axios';
import './BI.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

const BI = () => {
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipoEmpresa: 'todos',
    rangoEdad: 'todos',
    nivelEstudio: 'todos',
    rangoSueldo: 'todos'
  });

  // Opciones de filtros
  const opcionesRangoEdad = ["18-25", "26-65", "65+"];
  const opcionesRangoSueldo = ["0-460", "460-750", "750-1500"];
  const opcionesNivelEstudio = ["Primaria", "Secundaria", "Superior", "Postgrado", "Ninguno"];
  const opcionesTipoEmpresa = ["Unipersonal", "Sociedad", "Cooperativa", "Asociación", "Fundación"];

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7075/api/Emprendedores');
        setEmprendedores(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Procesamiento de datos
  const procesarDatos = useMemo(() => {
    return emprendedores.map(emp => ({
      ...emp,
      edadNum: parseInt(emp.edad) || 0,
      sueldoNum: parseFloat(emp.sueldo_mensual) || 0,
      totalEmpleados: (parseInt(emp.empleados_hombres) || 0) + (parseInt(emp.empleados_mujeres) || 0),
      nivelEstudio: emp.nivel_estudio || 'No especificado',
      trabajoRelacionDependencia: emp.trabajo_relacion_dependencia === 1,
      tipoEmpresa: emp.tipo_empresa || 'No especificado'
    }));
  }, [emprendedores]);

  // Aplicar filtros
  const datosFiltrados = useMemo(() => {
    let filtrados = [...procesarDatos];

    if (filtros.tipoEmpresa !== 'todos') {
      filtrados = filtrados.filter(emp => emp.tipoEmpresa === filtros.tipoEmpresa);
    }

    if (filtros.rangoEdad !== 'todos') {
      const [min, max] = filtros.rangoEdad.split('-').map(Number);
      const maxValue = isNaN(max) ? 1000 : max; // Para manejar el caso "65+"
      filtrados = filtrados.filter(emp => {
        const edad = emp.edadNum;
        return edad >= min && (isNaN(max) ? true : edad <= maxValue);
      });
    }

    if (filtros.nivelEstudio !== 'todos') {
      filtrados = filtrados.filter(emp => emp.nivelEstudio === filtros.nivelEstudio);
    }

    if (filtros.rangoSueldo !== 'todos') {
      const [min, max] = filtros.rangoSueldo.split('-').map(Number);
      const maxValue = isNaN(max) ? 10000 : max;
      filtrados = filtrados.filter(emp => {
        const sueldo = emp.sueldoNum;
        return sueldo >= min && (isNaN(max) ? true : sueldo <= maxValue);
      });
    }

    return filtrados;
  }, [procesarDatos, filtros]);

  // Datos para gráficos
  const distribucionEdades = useMemo(() => {
    const grupos = opcionesRangoEdad.reduce((acc, rango) => {
      acc[rango] = 0;
      return acc;
    }, {});

    datosFiltrados.forEach(emp => {
      const edad = emp.edadNum;
      if (edad >= 18 && edad <= 25) grupos['18-25']++;
      else if (edad <= 65) grupos['26-65']++;
      else grupos['65+']++;
    });

    return Object.keys(grupos).map(key => ({
      name: key,
      value: grupos[key]
    }));
  }, [datosFiltrados]);

  const distribucionNivelEstudio = useMemo(() => {
    const niveles = datosFiltrados.reduce((acc, emp) => {
      const nivel = emp.nivelEstudio || 'No especificado';
      acc[nivel] = (acc[nivel] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(niveles).map(key => ({
      name: key,
      value: niveles[key]
    }));
  }, [datosFiltrados]);

  const relacionDependencia = useMemo(() => {
    const counts = datosFiltrados.reduce((acc, emp) => {
      const tipo = emp.trabajoRelacionDependencia ? 'Dependencia' : 'Independiente';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [datosFiltrados]);

  const distribucionTipoEmpresa = useMemo(() => {
    const tipos = datosFiltrados.reduce((acc, emp) => {
      const tipo = emp.tipoEmpresa;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(tipos).map(key => ({
      name: key,
      value: tipos[key]
    }));
  }, [datosFiltrados]);

  const distribucionSueldos = useMemo(() => {
    const grupos = opcionesRangoSueldo.reduce((acc, rango) => {
      acc[rango] = 0;
      return acc;
    }, {});

    datosFiltrados.forEach(emp => {
      const sueldo = emp.sueldoNum;
      if (sueldo <= 460) grupos['0-460']++;
      else if (sueldo <= 750) grupos['460-750']++;
      else grupos['750-1500']++;
    });

    return Object.keys(grupos).map(key => ({
      name: key,
      value: grupos[key]
    }));
  }, [datosFiltrados]);

// KPI
const kpis = useMemo(() => {
    const totalEmpleados = datosFiltrados.reduce((sum, emp) => sum + emp.totalEmpleados, 0);
    const sueldos = datosFiltrados.filter(emp => emp.sueldoNum > 0).map(emp => emp.sueldoNum);
    const promedioSueldos = sueldos.length > 0 
      ? sueldos.reduce((sum, val) => sum + val, 0) / sueldos.length
      : 0;
    
    // Corregido: Asegurarse de que datosFiltrados.length no sea 0 para evitar división por cero
    const promedioEdad = datosFiltrados.length > 0 
      ? datosFiltrados.reduce((sum, emp) => sum + emp.edadNum, 0) / datosFiltrados.length 
      : 0;
  
    return {
      totalEmpleados,
      promedioSueldos: promedioSueldos.toFixed(2),
      totalEmprendedores: datosFiltrados.length,
      promedioEdad: promedioEdad
    };
  }, [datosFiltrados]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  return (
    <div className="bi-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">DASHBOARD EMPRENDEDORES</h1>
        
        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Tipo de Empresa:</label>
            <select 
              name="tipoEmpresa" 
              value={filtros.tipoEmpresa} 
              onChange={handleFiltroChange}
            >
              <option value="todos">Todos</option>
              {opcionesTipoEmpresa.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          
          <div className="filtro-group">
            <label>Rango de Edad:</label>
            <select 
              name="rangoEdad" 
              value={filtros.rangoEdad} 
              onChange={handleFiltroChange}
            >
              <option value="todos">Todos</option>
              {opcionesRangoEdad.map(rango => (
                <option key={rango} value={rango}>{rango} años</option>
              ))}
            </select>
          </div>
          
          <div className="filtro-group">
            <label>Nivel de Estudio:</label>
            <select 
              name="nivelEstudio" 
              value={filtros.nivelEstudio} 
              onChange={handleFiltroChange}
            >
              <option value="todos">Todos</option>
              {opcionesNivelEstudio.map(nivel => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Rango de Sueldo:</label>
            <select 
              name="rangoSueldo" 
              value={filtros.rangoSueldo} 
              onChange={handleFiltroChange}
            >
              <option value="todos">Todos</option>
              {opcionesRangoSueldo.map(rango => (
                <option key={rango} value={rango}>${rango}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Emprendedores</h3>
            <div className="kpi-value">{kpis.totalEmprendedores}</div>
          </div>
          <div className="kpi-card">
            <h3>Total Empleados</h3>
            <div className="kpi-value">{kpis.totalEmpleados}</div>
          </div>
          <div className="kpi-card">
            <h3>Promedio Sueldos</h3>
            <div className="kpi-value">${kpis.promedioSueldos}</div>
          </div>
          <div className="kpi-card">
            <h3>Edad Promedio</h3>
            <div className="kpi-value">{kpis.promedioEdad.toFixed(1)} años</div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="dashboard-grid">
          {/* Distribución por edades */}
          <div className="chart-card">
            <h3>Distribución por Edades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribucionEdades}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Emprendedores" fill="#8884d8">
                  {distribucionEdades.map((entry, index) => (
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
                  data={distribucionNivelEstudio}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {distribucionNivelEstudio.map((entry, index) => (
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
                  data={relacionDependencia}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {relacionDependencia.map((entry, index) => (
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
                data={distribucionTipoEmpresa}
                layout="vertical"
                margin={{ left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Emprendedores" fill="#8884d8">
                  {distribucionTipoEmpresa.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución de sueldos */}
          <div className="chart-card">
            <h3>Distribución de Sueldos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribucionSueldos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Emprendedores" fill="#8884d8">
                  {distribucionSueldos.map((entry, index) => (
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
              <BarChart
                data={[
                  {
                    name: 'Hombres',
                    value: datosFiltrados.reduce((sum, emp) => sum + (parseInt(emp.empleados_hombres) || 0), 0)
                  },
                  {
                    name: 'Mujeres',
                    value: datosFiltrados.reduce((sum, emp) => sum + (parseInt(emp.empleados_mujeres) || 0), 0)
                  }
                ]}
              >
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
        </div>
      </main>
    </div>
  );
};

export default BI;