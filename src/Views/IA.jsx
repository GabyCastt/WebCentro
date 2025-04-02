import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IA.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Side-bar/Sidebar';

const IA = () => {
  const [formData, setFormData] = useState({
    name: '',
    characteristics: '',
    business_type: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5003/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data);
      } else {
        setError(data.message || 'Error al generar el logo y eslogan');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ia-container">
      <Header />
      <Sidebar />
      <main className="ia-main-content">
        <h1 className="ia-title">GENERADOR DE LOGOS Y ESLÓGANES</h1>
        
        <form onSubmit={handleSubmit} className="ia-generator-form">
          <div className="ia-form-group">
            <label htmlFor="name">Nombre del Emprendimiento:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="ia-input"
            />
          </div>

          <div className="ia-form-group">
            <label htmlFor="characteristics">Características:</label>
            <textarea
              id="characteristics"
              name="characteristics"
              value={formData.characteristics}
              onChange={handleChange}
              required
              className="ia-textarea"
            />
          </div>

          <div className="ia-form-group">
            <label htmlFor="business_type">Tipo de Negocio:</label>
            <input
              type="text"
              id="business_type"
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              required
              className="ia-input"
            />
          </div>

          <div className="ia-actions-container">
            <button 
              type="submit" 
              disabled={loading}
              className="ia-primary-btn"
            >
              {loading ? 'Generando...' : 'Generar Logo y Eslogan'}
            </button>
          </div>
        </form>

        {error && <div className="ia-error-message">{error}</div>}

        {result && (
          <div className="ia-result-container">
            <h2 className="ia-subtitle">Resultados para {formData.name}</h2>
            
            <div className="ia-slogan-result">
              <h3 className="ia-result-title">Eslogan:</h3>
              <p className="ia-slogan-text">{result.slogan}</p>
            </div>

            <div className="ia-logo-result">
              <h3 className="ia-result-title">Logo:</h3>
              {result.logo_url && (
                <img 
                  src={result.logo_url} 
                  alt={`Logo para ${formData.name}`} 
                  className="ia-logo-image"
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default IA;