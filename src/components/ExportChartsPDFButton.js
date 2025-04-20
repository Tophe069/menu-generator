import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ExportChartsPDFButton({ chartContainerId }) {
  const exporting = useRef(false);
  async function handleExport() {
    if (exporting.current) return;
    exporting.current = true;
    const chartNode = document.getElementById(chartContainerId);
    if (!chartNode) {
      alert('Graphique introuvable.');
      exporting.current = false;
      return;
    }
    const canvas = await html2canvas(chartNode, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 40, imgWidth, imgHeight);
    pdf.save('graphiques-nutrition.pdf');
    exporting.current = false;
  }
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4 mr-2"
      onClick={handleExport}
    >
      Exporter les graphiques en PDF
    </button>
  );
}
