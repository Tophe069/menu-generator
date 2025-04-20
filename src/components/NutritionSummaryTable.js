import React from 'react';

import { getNutritionObjectives } from '../utils/objectives';

export default function NutritionSummaryTable({ weeklyMenu, userProfile }) {
  // Calcul des totaux par jour et global
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const mealTypes = [
    { key: 'petitDej', label: 'Petit-déjeuner' },
    { key: 'dejeuner', label: 'Déjeuner' },
    { key: 'diner', label: 'Dîner' },
  ];

  const dailyTotals = weeklyMenu.map(day => {
    let cal = 0, prot = 0, gluc = 0, lip = 0, ca = 0, fer = 0;
    mealTypes.forEach(m => {
      const r = day[m.key];
      if (r) {
        cal += r.calories || 0;
        prot += r.macros.proteines || 0;
        gluc += r.macros.glucides || 0;
        lip += r.macros.lipides || 0;
        ca += r.micronutrients.calcium || 0;
        fer += r.micronutrients.fer || 0;
      }
    });
    return { cal, prot, gluc, lip, ca, fer };
  });

  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const total = {
    cal: sum(dailyTotals.map(d => d.cal)),
    prot: sum(dailyTotals.map(d => d.prot)),
    gluc: sum(dailyTotals.map(d => d.gluc)),
    lip: sum(dailyTotals.map(d => d.lip)),
    ca: sum(dailyTotals.map(d => d.ca)),
    fer: sum(dailyTotals.map(d => d.fer)),
  };

  const objectives = getNutritionObjectives(userProfile || {});
  // Fonctions d’évaluation
  function evalValue(val, objectif) {
    if (!objectif) return { color: '', icon: '' };
    if (val === objectif) return { color: 'bg-green-100 text-green-700', icon: '✅' };
    if (val < objectif) return { color: 'bg-orange-100 text-orange-700', icon: '⚠️' };
    if (val > objectif) return { color: 'bg-red-100 text-red-700', icon: '⬆️' };
    return { color: '', icon: '' };
  }
  // Résumé hebdo
  let daysOk = 0, daysWarn = 0, daysOver = 0;
  dailyTotals.forEach(d => {
    let ok = true;
    if (objectives.calories && d.cal !== objectives.calories) ok = false;
    if (objectives.proteines && d.prot < objectives.proteines) ok = false;
    if (objectives.glucides && d.gluc < objectives.glucides) ok = false;
    if (objectives.lipides && d.lip < objectives.lipides) ok = false;
    if (objectives.calcium && d.ca < objectives.calcium) ok = false;
    if (objectives.fer && d.fer < objectives.fer) ok = false;
    if (ok) daysOk++; else daysWarn++;
  });

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <div className="mb-2">
        {daysWarn === 0 ? (
          <div className="bg-green-100 text-green-800 rounded px-3 py-2 font-semibold mb-2">✅ Tous les jours atteignent vos objectifs nutritionnels cette semaine.</div>
        ) : (
          <div className="bg-orange-100 text-orange-800 rounded px-3 py-2 font-semibold mb-2">⚠️ {daysWarn} jour(s) hors objectif cette semaine.</div>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-4">Tableau récapitulatif nutritionnel</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-indigo-100">
              <th className="p-2 border">Jour</th>
              <th className="p-2 border">Calories</th>
              <th className="p-2 border">Protéines (g)</th>
              <th className="p-2 border">Glucides (g)</th>
              <th className="p-2 border">Lipides (g)</th>
              <th className="p-2 border">Calcium (mg)</th>
              <th className="p-2 border">Fer (mg)</th>
            </tr>
          </thead>
          <tbody>
            {dailyTotals.map((d, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="p-2 border font-semibold">{days[idx % 7]}</td>
                <td className={`p-2 border ${evalValue(d.cal, objectives.calories).color}`}>
                  {d.cal} <span>{evalValue(d.cal, objectives.calories).icon}</span>
                </td>
                <td className={`p-2 border ${evalValue(d.prot, objectives.proteines).color}`}>
                  {d.prot} <span>{evalValue(d.prot, objectives.proteines).icon}</span>
                </td>
                <td className={`p-2 border ${evalValue(d.gluc, objectives.glucides).color}`}>
                  {d.gluc} <span>{evalValue(d.gluc, objectives.glucides).icon}</span>
                </td>
                <td className={`p-2 border ${evalValue(d.lip, objectives.lipides).color}`}>
                  {d.lip} <span>{evalValue(d.lip, objectives.lipides).icon}</span>
                </td>
                <td className={`p-2 border ${evalValue(d.ca, objectives.calcium).color}`}>
                  {d.ca} <span>{evalValue(d.ca, objectives.calcium).icon}</span>
                </td>
                <td className={`p-2 border ${evalValue(d.fer, objectives.fer).color}`}>
                  {d.fer} <span>{evalValue(d.fer, objectives.fer).icon}</span>
                </td>
              </tr>
            ))}
            <tr className="bg-green-100 font-bold">
              <td className="p-2 border">Total</td>
              <td className="p-2 border">{total.cal}</td>
              <td className="p-2 border">{total.prot}</td>
              <td className="p-2 border">{total.gluc}</td>
              <td className="p-2 border">{total.lip}</td>
              <td className="p-2 border">{total.ca}</td>
              <td className="p-2 border">{total.fer}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Conseils personnalisés */}
      {daysWarn > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded text-sm text-yellow-900">
          <b>Conseils :</b>
          <ul className="list-disc pl-5 mt-1">
            {objectives.calories && dailyTotals.filter(d => d.cal < objectives.calories).length > 0 && (
              <li>Augmente légèrement la taille des portions ou ajoute une collation pour atteindre ton objectif calorique.</li>
            )}
            {objectives.calories && dailyTotals.filter(d => d.cal > objectives.calories).length > 0 && (
              <li>Diminue les quantités d’aliments riches en calories ou privilégie des recettes plus légères certains jours.</li>
            )}
            {objectives.proteines && dailyTotals.filter(d => d.prot < objectives.proteines).length > 0 && (
              <li>Ajoute une source de protéines (œuf, fromage blanc, légumineuses, poisson…) à tes repas.</li>
            )}
            {objectives.glucides && dailyTotals.filter(d => d.gluc < objectives.glucides).length > 0 && (
              <li>Complète avec une portion de féculents (pain complet, riz, pâtes, pommes de terre…).</li>
            )}
            {objectives.lipides && dailyTotals.filter(d => d.lip < objectives.lipides).length > 0 && (
              <li>Ajoute un filet d’huile végétale ou quelques oléagineux pour couvrir tes besoins en lipides.</li>
            )}
            {objectives.calcium && dailyTotals.filter(d => d.ca < objectives.calcium).length > 0 && (
              <li>Intègre des produits laitiers, des amandes ou des légumes verts pour augmenter ton apport en calcium.</li>
            )}
            {objectives.fer && dailyTotals.filter(d => d.fer < objectives.fer).length > 0 && (
              <li>Pense à consommer de la viande rouge, des lentilles ou du persil pour booster ton apport en fer.</li>
            )}
            {daysWarn > 3 && (
              <li>Essaie de varier davantage tes repas sur la semaine pour équilibrer tes apports.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
