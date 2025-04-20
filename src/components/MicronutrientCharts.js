import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { getNutritionObjectives } from '../utils/objectives';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

import NutritionScoreChart from './NutritionScoreChart';
import ExportPDFButton from './ExportPDFButton';
import ExportChartsPDFButton from './ExportChartsPDFButton';
import ExportCSVButton from './ExportCSVButton';

export default function MicronutrientCharts({ weeklyMenu, userProfile }) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const mealTypes = ['petitDej', 'dejeuner', 'diner'];
  const labels = days.slice(0, weeklyMenu.length);

  // Extraction des données micronutriments
  const daily = weeklyMenu.map(day => {
    let ca = 0, fer = 0, mg = 0, vitC = 0;
    mealTypes.forEach(m => {
      const r = day[m];
      if (r && r.micronutrients) {
        ca += r.micronutrients.calcium || 0;
        fer += r.micronutrients.fer || 0;
        mg += r.micronutrients.magnesium || 0;
        vitC += r.micronutrients.vitC || 0;
      }
    });
    return { ca, fer, mg, vitC };
  });

  function colorArray(values, objectif) {
    return values.map(v => {
      if (!objectif) return 'rgba(59,130,246,0.7)';
      if (v === objectif) return 'rgba(16,185,129,0.8)'; // vert
      if (v < objectif) return 'rgba(251,191,36,0.8)'; // orange
      if (v > objectif) return 'rgba(239,68,68,0.8)'; // rouge
      return 'rgba(59,130,246,0.7)';
    });
  }

  const calcium = daily.map(d => d.ca);
  const fer = daily.map(d => d.fer);
  const magnesium = daily.map(d => d.mg);
  const vitC = daily.map(d => d.vitC);

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Calcium (mg)',
        data: calcium,
        backgroundColor: colorArray(calcium, getNutritionObjectives(userProfile || {}).calcium),
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Fer (mg)',
        data: fer,
        backgroundColor: colorArray(fer, getNutritionObjectives(userProfile || {}).fer),
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Magnésium (mg)',
        data: magnesium,
        backgroundColor: colorArray(magnesium, getNutritionObjectives(userProfile || {}).magnesium),
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Vitamine C (mg)',
        data: vitC,
        backgroundColor: colorArray(vitC, getNutritionObjectives(userProfile || {}).vitC),
        yAxisID: 'y',
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  };

  const objectives = getNutritionObjectives(userProfile || {});
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Micronutriments par jour' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex;
            const val = context.raw;
            let objectif = null;
            if (context.dataset.label === 'Calcium') objectif = objectives.calcium;
            if (context.dataset.label === 'Fer') objectif = objectives.fer;
            let base = `${context.dataset.label}: ${val}`;
            if (objectif) {
              if (val === objectif) base += ' (objectif atteint)';
              else if (val < objectif) base += ` (manque ${objectif - val})`;
              else if (val > objectif) base += ` (+${val - objectif} au-dessus de l’objectif)`;
            }
            return base;
          }
        }
      },
      annotation: {
        annotations: {
          ...(objectives.calcium ? {
            caLine: {
              type: 'line',
              yMin: objectives.calcium,
              yMax: objectives.calcium,
              borderColor: 'rgba(59,130,246,0.8)',
              borderWidth: 2,
              label: {
                content: 'Objectif calcium',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(59,130,246,0.2)',
                color: '#222',
              },
              yScaleID: 'y',
            }
          } : {}),
          ...(objectives.fer ? {
            ferLine: {
              type: 'line',
              yMin: objectives.fer,
              yMax: objectives.fer,
              borderColor: 'rgba(234,179,8,0.8)',
              borderWidth: 2,
              label: {
                content: 'Objectif fer',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(234,179,8,0.2)',
                color: '#222',
              },
              yScaleID: 'y',
            }
          } : {}),
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'mg' },
      },
    },
  };

  return (
    <>
      {weeklyMenu && weeklyMenu.length > 0 && (
        <>
          <ExportPDFButton weeklyMenu={weeklyMenu} userProfile={userProfile} />
          <ExportCSVButton weeklyMenu={weeklyMenu} />
          <ExportChartsPDFButton chartContainerId="charts-to-export" />
          <div id="charts-to-export">
            <NutritionScoreChart weeklyMenu={weeklyMenu} />
            <div className="bg-white rounded shadow p-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">Micronutriments par jour</h3>
              <Bar
                options={options}
                data={data}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
