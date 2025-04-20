import React from 'react';

export default function ExportCSVButton({ weeklyMenu }) {
  if (!weeklyMenu || !weeklyMenu.length) return null;

  function handleExport() {
    const headers = [
      'Jour', 'Repas', 'Nom', 'Calories', 'Protéines (g)', 'Glucides (g)', 'Lipides (g)', 'Calcium (mg)', 'Fer (mg)', 'Ingrédients'
    ];
    const rows = [];
    weeklyMenu.forEach((day, idx) => {
      ['petitDej','dejeuner','diner'].forEach(type => {
        const repas = day[type];
        if (!repas) return;
        const ingredients = (repas.ingredientsDetails || repas.ingredients).map(ing => {
          if (typeof ing === 'object' && ing !== null) {
            return `${ing.nom} (${ing.quantite ? ing.quantite + ' ' + (ing.unite || '') : 'qté à ajuster'})`;
          } else {
            return `${ing} (qté à ajuster)`;
          }
        }).join(' | ');
        rows.push([
          idx + 1,
          type === 'petitDej' ? 'Petit-déjeuner' : type === 'dejeuner' ? 'Déjeuner' : 'Dîner',
          repas.name,
          repas.calories,
          repas.macros?.proteines,
          repas.macros?.glucides,
          repas.macros?.lipides,
          repas.micronutrients?.calcium,
          repas.micronutrients?.fer,
          ingredients
        ]);
      });
    });
    let csv = headers.join(';') + '\n';
    csv += rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-hebdomadaire.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4 mr-2"
      onClick={handleExport}
    >
      Exporter le menu en CSV
    </button>
  );
}
