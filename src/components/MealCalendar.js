import React from 'react';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const meals = [
  { key: 'petitDej', label: 'Petit-déjeuner' },
  { key: 'dejeuner', label: 'Déjeuner' },
  { key: 'diner', label: 'Dîner' },
];

export default function MealCalendar({ weeklyMenu, onSelectMeal }) {
  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Calendrier des repas</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-indigo-100">
              <th className="p-2 border">Jour</th>
              {meals.map(meal => (
                <th key={meal.key} className="p-2 border">{meal.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklyMenu.map((day, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="p-2 border font-semibold">{days[idx % 7]}</td>
                {meals.map(meal => (
                  <td key={meal.key} className="p-2 border">
                    {day[meal.key] ? (
                      <button
                        className="text-indigo-700 hover:underline"
                        onClick={() => onSelectMeal && onSelectMeal(day[meal.key], idx, meal.key)}
                      >
                        {day[meal.key].name}
                      </button>
                    ) : <span className="italic text-gray-400">Aucune recette</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
