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

export default function NutritionCharts({ weeklyMenu, userProfile }) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const mealTypes = ['petitDej', 'dejeuner', 'diner'];
  const labels = days.slice(0, weeklyMenu.length);

  // Extraction des données
  const daily = weeklyMenu.map(day => {
    let cal = 0, prot = 0, gluc = 0, lip = 0;
    mealTypes.forEach(m => {
      const r = day[m];
      if (r) {
        cal += r.calories || 0;
        prot += r.macros.proteines || 0;
        gluc += r.macros.glucides || 0;
        lip += r.macros.lipides || 0;
      }
    });
    return { cal, prot, gluc, lip };
  });

  // Génération des couleurs dynamiques
  function colorArray(values, objectif) {
    return values.map(v => {
      if (!objectif) return 'rgba(99,102,241,0.7)';
      if (v === objectif) return 'rgba(16,185,129,0.8)'; // vert
      if (v < objectif) return 'rgba(251,191,36,0.8)'; // orange
      if (v > objectif) return 'rgba(239,68,68,0.8)'; // rouge
      return 'rgba(99,102,241,0.7)';
    });
  }

  const calories = daily.map(d => d.cal);
  const proteines = daily.map(d => d.prot);
  const glucides = daily.map(d => d.gluc);
  const lipides = daily.map(d => d.lip);

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Calories',
        data: calories,
        backgroundColor: colorArray(calories, null),
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Protéines (g)',
        data: proteines,
        backgroundColor: colorArray(proteines, null),
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Glucides (g)',
        data: glucides,
        backgroundColor: colorArray(glucides, null),
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Lipides (g)',
        data: lipides,
        backgroundColor: colorArray(lipides, null),
        yAxisID: 'y1',
      },
    ],
  };

  const objectives = getNutritionObjectives(userProfile || {});
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Apports nutritionnels par jour' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex;
            const val = context.raw;
            let objectif = null;
            if (context.dataset.label === 'Calories') objectif = objectives.calories;
            if (context.dataset.label === 'Protéines') objectif = objectives.proteines;
            if (context.dataset.label === 'Glucides') objectif = objectives.glucides;
            if (context.dataset.label === 'Lipides') objectif = objectives.lipides;
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
          ...(objectives.calories ? {
            calLine: {
              type: 'line',
              yMin: objectives.calories,
              yMax: objectives.calories,
              borderColor: 'rgba(99,102,241,0.8)',
              borderWidth: 2,
              label: {
                content: 'Objectif kcal',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(99,102,241,0.2)',
                color: '#222',
              },
              yScaleID: 'y',
            }
          } : {}),
          ...(objectives.proteines ? {
            protLine: {
              type: 'line',
              yMin: objectives.proteines,
              yMax: objectives.proteines,
              borderColor: 'rgba(16,185,129,0.8)',
              borderWidth: 2,
              label: {
                content: 'Objectif prot.',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(16,185,129,0.2)',
                color: '#222',
              },
              yScaleID: 'y1',
            }
          } : {}),
          ...(objectives.glucides ? {
            glucLine: {
              type: 'line',
              yMin: objectives.glucides,
              yMax: objectives.glucides,
              borderColor: 'rgba(251,191,36,0.8)',
              borderWidth: 2,
              label: {
                content: 'Objectif gluc.',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(251,191,36,0.2)',
                color: '#222',
              },
              yScaleID: 'y1',
            }
          } : {}),
          ...(objectives.lipides ? {
            lipLine: {
              type: 'line',
              yMin: objectives.lipides,
              yMax: objectives.lipides,
              borderColor: 'rgba(239,68,68,0.8)',
              borderWidth: 2,
              label: {
                content: 'Objectif lip.',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(239,68,68,0.2)',
                color: '#222',
              },
              yScaleID: 'y1',
            }
          } : {}),
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Calories' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'g (protéines, glucides, lipides)' },
      },
    },
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Graphique nutritionnel</h3>
      <Bar data={data} options={options} height={120} />
    </div>
  );
}
