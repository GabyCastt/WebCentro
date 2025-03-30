import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReporteriaRol.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/Side-bar/Sidebar";
import jsPDF from "jspdf";
import logoCentro from "../assets/LogoCentro.jpg"; // Importación correcta del logo

function ReporteriaRol() {
  const [searchTerm, setSearchTerm] = useState("");
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const filteredEmprendedores = emprendedores.filter((emprendedor) => {
    const matchesSearch =
      emprendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emprendedor.correo &&
        emprendedor.correo.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!selectedDate) return matchesSearch;

    const emprendedorDate = new Date(emprendedor.fechaCreacion)
      .toISOString()
      .split("T")[0];
    return matchesSearch && emprendedorDate === selectedDate;
  });

  const handleDetailsClick = (idEmprendedor) => {
    navigate(`/reporteriadetallerol/${idEmprendedor}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleButton1Click = async (format = "pdf") => {
    const reportTitle = selectedDate
      ? `Reporte de Emprendedores - ${selectedDate}`
      : "Reporte General de Emprendedores";

    const currentDate = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (format === "csv") {
      // Cabecera del CSV con información institucional
      let csvContent = `"Centro de Emprendimiento","","",""\n`;
      csvContent += `"Reporte de Emprendedores","","",""\n`;
      csvContent += `"Fecha de generación: ${currentDate}","","",""\n\n`;

      // Encabezados de columnas
      csvContent +=
        '"N°","Nombre del Emprendedor","Correo Electrónico","Fecha de Registro"\n';

      // Datos
      filteredEmprendedores.forEach((emprendedor, index) => {
        csvContent += `"${index + 1}","${emprendedor.nombre}","${
          emprendedor.correo || "No registrado"
        }","${formatDate(emprendedor.fechaCreacion)}"\n`;
      });

      // Espacio para firma
      csvContent += '\n\n"","","",""\n';
      csvContent += '"","","","________________________"\n';
      csvContent += '"","","","Firma del Responsable"\n';
      csvContent += `"Documento generado el: ${currentDate}","","",""\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedDate
          ? `reporte_emprendedores_${selectedDate}.csv`
          : "reporte_emprendedores_general.csv"
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Configuración del PDF mejorado
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Margenes y colores
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const primaryColor = [20, 14, 78]; // Azul oscuro institucional
      const secondaryColor = [128, 128, 128]; // Oro como secundarioo corporativo
      const lightGray = [248, 248, 248]; // Gris de fondo
      const darkGray = [68, 68, 68]; // Texto oscuro
      const textColor = [34, 34, 34]; // Texto principal

      // Agregar encabezado con logo y título
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 25, "F");

      try {
        // Agregar logo (ajusta las coordenadas y tamaño según necesites)
        if (logoCentro) {
          // Convertir la imagen a Base64 para jsPDF
          const response = await fetch(logoCentro);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onload = function () {
            const imageData = reader.result;
            doc.addImage(imageData, "JPEG", margin, 5, 30, 15);
            generatePDFContent(); // Continuar con la generación del PDF después de cargar la imagen
          };

          reader.readAsDataURL(blob);
        } else {
          generatePDFContent(); // Continuar sin logo si no está disponible
        }
      } catch (error) {
        console.error("Error al cargar el logo:", error);
        generatePDFContent(); // Continuar sin logo si hay error
      }

      const generatePDFContent = () => {
        // Texto del título en el encabezado (blanco)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(reportTitle, pageWidth / 2, 17, { align: "center" });

        // Información de la fecha de generación
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.setFontSize(10);
        doc.text(`Generado el: ${currentDate}`, pageWidth - margin, 35, {
          align: "right",
        });

        // Subtítulo con cantidad de registros
        doc.setFontSize(12);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(
          `Total de emprendedores: ${filteredEmprendedores.length}`,
          margin,
          35
        );

        // Encabezados de la tabla
        const headers = [
          "N°",
          "Nombre del Emprendedor",
          "Correo Electrónico",
          "Fecha de Registro",
        ];
        const columnPositions = [
          margin,
          margin + 15,
          margin + 80,
          margin + 140,
        ];

        // Fondo para los encabezados
        doc.setFillColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        doc.rect(margin, 40, pageWidth - 2 * margin, 8, "F");

        // Texto de los encabezados (blanco)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        headers.forEach((header, index) => {
          doc.text(header, columnPositions[index], 45);
        });

        // Contenido de la tabla
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        let y = 55;
        filteredEmprendedores.forEach((emprendedor, index) => {
          // Filas alternas con color de fondo
          if (index % 2 === 0) {
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
            doc.rect(margin, y - 4, pageWidth - 2 * margin, 8, "F");
          }

          doc.text(`${index + 1}`, columnPositions[0], y);
          doc.text(emprendedor.nombre, columnPositions[1], y);
          doc.text(
            emprendedor.correo || "No registrado",
            columnPositions[2],
            y
          );
          doc.text(
            formatDate(emprendedor.fechaCreacion),
            columnPositions[3],
            y
          );

          y += 8;

          // Nueva página si se llega al final
          if (y > 270) {
            doc.addPage();
            y = 20;

            // Repetir encabezado en nuevas páginas
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, pageWidth, 25, "F");

            if (logoCentro) {
              doc.addImage(logoCentro, "JPEG", margin, 5, 30, 15);
            }

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(reportTitle, pageWidth / 2, 17, { align: "center" });

            // Encabezados de tabla en nueva página
            doc.setFillColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            doc.rect(margin, y - 15, pageWidth - 2 * margin, 8, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            headers.forEach((header, i) => {
              doc.text(header, columnPositions[i], y - 10);
            });

            y += 15;
          }
        });

        // Pie de página con espacio para firma
        const footerY = y + 20;
        doc.setFontSize(10);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text(`Documento generado el: ${currentDate}`, margin, footerY);

        // Línea para firma
        doc.setDrawColor(0, 0, 0);
        doc.line(
          pageWidth - margin - 50,
          footerY + 15,
          pageWidth - margin,
          footerY + 15
        );
        doc.text(
          "Firma del responsable",
          pageWidth - margin - 25,
          footerY + 20,
          { align: "center" }
        );

        doc.save(
          selectedDate
            ? `reporte_emprendedores_${selectedDate}.pdf`
            : "reporte_emprendedores_general.pdf"
        );
      };
    }
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
          <input
            type="text"
            className="reporteria-rol-search-input"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="reporteria-rol-date-filter-container">
            <button
              className="reporteria-rol-date-filter-btn"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {selectedDate ? `Fecha: ${selectedDate}` : "Filtrar por fecha"}
            </button>

            {showDatePicker && (
              <input
                type="date"
                className="reporteria-rol-date-picker"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }}
              />
            )}

            {selectedDate && (
              <button
                className="reporteria-rol-clear-date-btn"
                onClick={() => setSelectedDate("")}
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>

        <table className="reporteria-rol-table">
          <thead className="reporteria-rol-table-header">
            <tr>
              <th className="reporteria-rol-table-header-cell">
                Fecha Registro
              </th>
              <th className="reporteria-rol-table-header-cell">
                Nombre Emprendedor
              </th>
              <th className="reporteria-rol-table-header-cell">Correo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="reporteria-rol-loading-cell">
                  Cargando datos...
                </td>
              </tr>
            ) : filteredEmprendedores.length > 0 ? (
              filteredEmprendedores.map((emprendedor) => (
                <tr
                  key={emprendedor.idEmprendedor}
                  className="reporteria-rol-table-row"
                >
                  <td className="reporteria-rol-table-cell">
                    {formatDate(emprendedor.fechaCreacion)}
                  </td>
                  <td className="reporteria-rol-table-cell">
                    {emprendedor.nombre}
                  </td>
                  <td className="reporteria-rol-table-cell">
                    {emprendedor.correo || "No registrado"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="reporteria-rol-no-data-cell">
                  No hay datos disponibles
                  {selectedDate ? ` para la fecha ${selectedDate}` : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="reporteria-rol-actions-container">
          <button
            className="reporteria-rol-primary-btn reporteria-rol-report-btn"
            onClick={() => handleButton1Click("pdf")}
          >
            Generar PDF
          </button>
          <button
            className="reporteria-rol-secondary-btn reporteria-rol-report-btn"
            onClick={() => handleButton1Click("csv")}
          >
            Generar CSV
          </button>
        </div>
      </main>
    </div>
  );
}

export default ReporteriaRol;
