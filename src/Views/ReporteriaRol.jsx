import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReporteriaRol.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoCentro from "../assets/LogoCentro.jpg";

function ReporteriaRol() {
  const [searchTerm, setSearchTerm] = useState("");
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEmprendedores = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7075/api/Emprendedores"
        );
        setEmprendedores(response.data);
      } catch (error) {
        console.warn("No se pudo obtener los datos del backend.");
        setEmprendedores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendedores();
  }, []);

  // Obtener años únicos de los registros
  const getUniqueYears = () => {
    const years = new Set();
    emprendedores.forEach((emprendedor) => {
      if (emprendedor.fechaRegistro) {
        const year = new Date(emprendedor.fechaRegistro).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Orden descendente
  };

  // Filtrar emprendedores según año y mes seleccionados
  const filteredEmprendedores = emprendedores.filter((emprendedor) => {
    if (!emprendedor.fechaRegistro) return false;

    const fechaRegistro = new Date(emprendedor.fechaRegistro);
    const registroYear = fechaRegistro.getFullYear().toString();
    const registroMonth = (fechaRegistro.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    // Filtro por búsqueda
    const matchesSearch =
      emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emprendedor.correo &&
        emprendedor.correo.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Aplicar filtros de año y mes
    const yearMatch = selectedYear ? registroYear === selectedYear : true;
    const monthMatch = selectedMonth ? registroMonth === selectedMonth : true;

    return yearMatch && monthMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
  };

  const handleButton1Click = async (format = "pdf") => {
    let reportTitle = "Reporte General de Emprendedores";
    let fileName = "reporte_emprendedores_general";

    if (selectedYear && selectedMonth) {
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      reportTitle = `Reporte de Emprendedores - ${
        monthNames[parseInt(selectedMonth) - 1]
      } ${selectedYear}`;
      fileName = `reporte_emprendedores_${selectedYear}_${selectedMonth}`;
    } else if (selectedYear) {
      reportTitle = `Reporte de Emprendedores - Año ${selectedYear}`;
      fileName = `reporte_emprendedores_${selectedYear}`;
    } else if (selectedMonth) {
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      reportTitle = `Reporte de Emprendedores - ${
        monthNames[parseInt(selectedMonth) - 1]
      }`;
      fileName = `reporte_emprendedores_mes_${selectedMonth}`;
    }

    const currentDate = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (format === "csv") {
      let csvContent = `Centro de Emprendimiento\n`;
      csvContent += `${reportTitle}\n`;
      csvContent += `Fecha de generación: ${currentDate}\n\n`;
      csvContent +=
        "N°;Nombre del Emprendedor;Correo Electrónico;Fecha de Registro\n";

      filteredEmprendedores.forEach((emprendedor, index) => {
        csvContent += `${index + 1};"${emprendedor.nombre}";"${
          emprendedor.correo || "No registrado"
        }";"${formatDate(emprendedor.fechaRegistro)}"\n`;
      });

      csvContent += "\n\n\n";
      csvContent += ";;;________________________\n";
      csvContent += ';;;"Firma del Responsable"\n';
      csvContent += `"Documento generado el: ${currentDate}"\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const doc = new jsPDF();

      // Agrega el fondo azul
      doc.setFillColor(20, 14, 78); // Azul institucional
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F");

      // Agrega el logo
      if (logoCentro) {
        try {
          const imgData = await getBase64Image(logoCentro);
          doc.addImage(imgData, "JPEG", 15, 10, 30, 15);
        } catch (error) {
          console.warn("No se pudo cargar el logo:", error);
        }
      }

      //  Configurar y colocar el título
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // Texto en blanco
      doc.text(
        reportTitle,
        doc.internal.pageSize.getWidth() / 2, // Centrado horizontalmente
        17, // Posición vertical ajustada
        { align: "center" }
      );
      // Información de generación
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${currentDate}`, 185, 15, { align: "right" });
      doc.text(`Total registros: ${filteredEmprendedores.length}`, 15, 30);

      // Tabla de datos
      const headers = [["#", "Nombre", "Correo", "Fecha Registro"]];
      const data = filteredEmprendedores.map((emp, index) => [
        index + 1,
        emp.nombre,
        emp.correo || "No registrado",
        formatDate(emp.fechaRegistro),
      ]);

      autoTable(doc, {
        startY: 35,
        head: [["#", "Nombre", "Correo", "Fecha Registro"]],
        body: filteredEmprendedores.map((emp, index) => [
          index + 1,
          emp.nombre,
          emp.correo || "No registrado",
          formatDate(emp.fechaRegistro),
        ]),
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [20, 14, 78],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
          3: { cellWidth: 30 },
        },
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: "center" });
        doc.text("Centro de Emprendimiento", 15, 285);
      }

      doc.save(`${fileName}.pdf`);
    }
  };

  const getBase64Image = (imgUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
    });
  };

  return (
    <div className="reporteria-rol-container">
      <Header />
      <Sidebar />
      <main className="reporteria-rol-main-content">
        <h1 className="reporteria-rol-title">
          REPORTERÍA HISTÓRICO EMPRENDEDORES
        </h1>

        <div className="reporteria-rol-filters-container">
          <div className="search-container">
            <input
              type="text"
              className="reporteria-rol-search-input"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="date-filters-container">
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="select-year">Año:</label>
                <select
                  id="select-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Todos los años</option>
                  {getUniqueYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="select-month">Mes:</label>
                <select
                  id="select-month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">Todos los meses</option>
                  <option value="01">Enero</option>
                  <option value="02">Febrero</option>
                  <option value="03">Marzo</option>
                  <option value="04">Abril</option>
                  <option value="05">Mayo</option>
                  <option value="06">Junio</option>
                  <option value="07">Julio</option>
                  <option value="08">Agosto</option>
                  <option value="09">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>

              {(selectedYear || selectedMonth) && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="report-actions">
          <button
            className="generate-pdf-btn"
            onClick={() => handleButton1Click("pdf")}
          >
            <i className="fas fa-file-pdf"></i> Generar PDF
          </button>
          <button
            className="generate-csv-btn"
            onClick={() => handleButton1Click("csv")}
          >
            <i className="fas fa-file-csv"></i> Generar CSV
          </button>
        </div>

        <div className="table-container">
          <table className="reporteria-rol-table">
            <thead className="reporteria-rol-table-header">
              <tr>
                <th className="reporteria-rol-table-header-cell">#</th>
                <th className="reporteria-rol-table-header-cell">Nombre</th>
                <th className="reporteria-rol-table-header-cell">Correo</th>
                <th className="reporteria-rol-table-header-cell">
                  Fecha Registro
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="loading-cell">
                    <div className="loading-spinner"></div>
                    Cargando datos...
                  </td>
                </tr>
              ) : filteredEmprendedores.length > 0 ? (
                filteredEmprendedores.map((emprendedor, index) => (
                  <tr
                    key={emprendedor.idEmprendedor}
                    className="reporteria-rol-table-row"
                  >
                    <td className="reporteria-rol-table-cell">{index + 1}</td>
                    <td className="reporteria-rol-table-cell">
                      {emprendedor.nombre}
                    </td>
                    <td className="reporteria-rol-table-cell">
                      {emprendedor.correo || "No registrado"}
                    </td>
                    <td className="reporteria-rol-table-cell">
                      {formatDate(emprendedor.fechaRegistro)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data-cell">
                    No hay datos disponibles
                    {selectedYear || selectedMonth
                      ? " con los filtros aplicados"
                      : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ReporteriaRol;
