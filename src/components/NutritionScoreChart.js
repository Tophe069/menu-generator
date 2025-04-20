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
import getNutritionScore from './getNutritionScore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function NutritionScoreChart({ weeklyMenu }) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const labels = days.slice(0, weeklyMenu.length);
  // Moyenne des scores par jour
  const scores = weeklyMenu.map(day => {
    let sum = 0, n = 0;
    ['petitDej','dejeuner','diner'].forEach(type => {
      if (day[type]) {
        sum += getNutritionScore(day[type]);
        n++;
      }
    });
    return n ? Math.round((sum / n) * 10) / 10 : 0;
  });
  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">Indice nutritionnel moyen par jour</h3>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Indice nutritionnel (0-10)',
              data: scores,
              backgroundColor: scores.map(s => s < 5 ? '#dc2626' : s < 8 ? '#f59e42' : '#16a34a'),
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `Score : ${ctx.parsed.y}`
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 10,
              title: { display: true, text: 'Score nutritionnel' }
            }
          }
        }}
      />
    </div>
  );
}
