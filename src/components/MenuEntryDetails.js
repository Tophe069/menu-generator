import React from 'react';
import getNutritionScore from './getNutritionScore';

export default function MenuEntryDetails({ day, data }) {
  if (!data) return null;
  return (
    <div className="bg-gray-50 rounded p-3 mb-3">
      <h4 className="font-semibold text-indigo-700 mb-1">{day}</h4>
      {['petitDej','dejeuner','diner'].map((type, idx) => {
        const repas = data[type];
        if (!repas) return null;
        return (
          <div key={type} className="mb-2">
            <span className="font-semibold capitalize">{type.replace('petitDej','Petit-déjeuner').replace('dejeuner','Déjeuner').replace('diner','Dîner')}</span> : <span className="italic">{repas.name}</span>
            <div className="ml-4 text-sm">
              <span className="font-semibold">Calories :</span> {repas.calories} kcal<br/>
              <span className="font-semibold">Macros :</span> Prot. {repas.macros?.proteines}g, Glu. {repas.macros?.glucides}g, Lip. {repas.macros?.lipides}g<br/>
              <span className="font-semibold">Micronutriments :</span> Ca {repas.micronutrients?.calcium}mg, Fe {repas.micronutrients?.fer}mg<br/>
              <span className="font-semibold">Indice nutritionnel :</span> {getNutritionScore(repas)} / 10
              <span style={{
                color:
                  getNutritionScore(repas) < 5 ? '#dc2626' :
                  getNutritionScore(repas) < 8 ? '#f59e42' : '#16a34a',
                fontWeight: 'bold',
                marginLeft: 8
              }}>
                {getNutritionScore(repas) < 5 ? '⚠️' : getNutritionScore(repas) < 8 ? '🟠' : '✅'}
              </span>
              <div className="mt-1">
                <span className="font-semibold">Ingrédients :</span>
                <ul className="list-disc pl-6">
                  {(repas.ingredientsDetails || repas.ingredients).map((ing, idx) => {
                    if (typeof ing === 'object' && ing !== null) {
                      return <li key={idx}>{ing.nom} : {ing.quantite ? `${ing.quantite} ${ing.unite || ''}` : 'quantité à ajuster'}</li>;
                    } else {
                      return <li key={idx}>{ing} : quantité à ajuster</li>;
                    }
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
