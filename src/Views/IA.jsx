import React, { useState, useEffect } from "react";

const AI_API_URL = "http://localhost:5003"; // URL del backend

const InteligenciaArtificial = () => {
  const [formData, setFormData] = useState({
    name: "",
    characteristics: "",
    business_type: "",
  });
  const [businessInfo, setBusinessInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateBusiness = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AI_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al generar el negocio.");
      }

      const data = await response.json();
      if (data.status === "success") {
        setBusinessInfo(data);
      } else {
        throw new Error(data.message || "Error inesperado");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${AI_API_URL}/get_files`);
        if (!response.ok) {
          throw new Error("Error al obtener los archivos.");
        }
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Centro de Investigación para Emprendimientos</h1>
          <p className="mt-2 text-blue-100">Generador de ideas y análisis para tu negocio</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={generateBusiness} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Emprendimiento
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: TechSolutions"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características
              </label>
              <input
                type="text"
                name="characteristics"
                value={formData.characteristics}
                onChange={handleInputChange}
                placeholder="Ej: Innovador, Sustentable, Digital"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Negocio
              </label>
              <input
                type="text"
                name="business_type"
                value={formData.business_type}
                onChange={handleInputChange}
                placeholder="Ej: Tecnología, Restaurante, Consultoría"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </span>
              ) : (
                "Generar Negocio"
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {businessInfo && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
                {businessInfo.slogan}
              </h2>
              {businessInfo.logo_url && (
                <div className="flex justify-center">
                  <img 
                    src={businessInfo.logo_url} 
                    alt="Logo" 
                    className="h-48 object-contain rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          )}
          
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Archivos en la Carpeta:
              </h3>
              <ul className="bg-gray-50 rounded-md border border-gray-200 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="p-3 text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      {file}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteligenciaArtificial;