import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportPDFButton({ weeklyMenu, userProfile }) {
  if (!weeklyMenu || !weeklyMenu.length) return null;

  function handleExport() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Menu hebdomadaire', 14, 16);
    doc.setFontSize(11);
    weeklyMenu.forEach((day, idx) => {
      const y = 26 + idx * 60;
      doc.text(`Jour ${idx + 1}`, 14, y);
      ['petitDej','dejeuner','diner'].forEach((type, i) => {
        const repas = day[type];
        if (!repas) return;
        doc.text(`${type === 'petitDej' ? 'Petit-déjeuner' : type === 'dejeuner' ? 'Déjeuner' : 'Dîner'} : ${repas.name}`, 20, y + 7 + i * 16);
        doc.text(`Calories : ${repas.calories} kcal`, 24, y + 13 + i * 16);
        doc.text(`Macros : Prot. ${repas.macros?.proteines}g, Glu. ${repas.macros?.glucides}g, Lip. ${repas.macros?.lipides}g`, 24, y + 19 + i * 16);
        doc.text(`Micronutriments : Ca ${repas.micronutrients?.calcium}mg, Fe ${repas.micronutrients?.fer}mg`, 24, y + 25 + i * 16);
        // Ingrédients
        doc.text('Ingrédients :', 28, y + 31 + i * 16);
        (repas.ingredientsDetails || repas.ingredients).forEach((ing, j) => {
          if (typeof ing === 'object' && ing !== null) {
            doc.text(`- ${ing.nom} : ${ing.quantite ? ing.quantite + ' ' + (ing.unite || '') : 'quantité à ajuster'}`, 32, y + 37 + i * 16 + j * 6);
          } else {
            doc.text(`- ${ing} : quantité à ajuster`, 32, y + 37 + i * 16 + j * 6);
          }
        });
      });
    });
    doc.save('menu-hebdomadaire.pdf');
  }

  return (
    <button
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mb-4"
      onClick={handleExport}
    >
      Exporter le menu en PDF
    </button>
  );
}
