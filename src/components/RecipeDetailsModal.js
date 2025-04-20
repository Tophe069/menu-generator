import React from 'react';

import RecipeReplaceSelector from './RecipeReplaceSelector';
import recipes from '../data/recipes';
import getNutritionScore from './getNutritionScore';

export default function RecipeDetailsModal({ recipe, onClose, onReplace }) {
  if (!recipe) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-indigo-600 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">{recipe.name}</h2>
        <div className="mb-2">
          <span className="font-semibold">Type :</span> {recipe.type.replace('-', ' ')}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Calories :</span> {recipe.calories} kcal
        </div>
        <div className="mb-2">
          <span className="font-semibold">Macros :</span>
          <ul className="list-disc pl-6">
            <li>Protéines : {recipe.macros.proteines} g</li>
            <li>Glucides : {recipe.macros.glucides} g</li>
            <li>Lipides : {recipe.macros.lipides} g</li>
          </ul>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Micronutriments :</span>
          <ul className="list-disc pl-6">
            <li>Calcium : {recipe.micronutrients.calcium} mg</li>
            <li>Fer : {recipe.micronutrients.fer} mg</li>
          </ul>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Indice nutritionnel :</span> {getNutritionScore(recipe)} / 10
          <span style={{
            color:
              getNutritionScore(recipe) < 5 ? '#dc2626' :
              getNutritionScore(recipe) < 8 ? '#f59e42' : '#16a34a',
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            {getNutritionScore(recipe) < 5 ? '⚠️' : getNutritionScore(recipe) < 8 ? '🟠' : '✅'}
          </span>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Ingrédients :</span>
          <ul className="list-disc pl-6">
            {(recipe.ingredientsDetails || recipe.ingredients).map((ing, idx) => {
              // Si ing est un objet { nom, quantite, unite }, sinon string
              if (typeof ing === 'object' && ing !== null) {
                return <li key={idx}>{ing.nom} : {ing.quantite ? `${ing.quantite} ${ing.unite || ''}` : 'quantité à ajuster'}</li>;
              } else {
                return <li key={idx}>{ing} : quantité à ajuster</li>;
              }
            })}
          </ul>
        </div>
        {recipe.allergens.length > 0 && (
          <div className="mb-2 text-red-600">
            <span className="font-semibold">Allergènes :</span> {recipe.allergens.join(', ')}
          </div>
        )}
        {recipe.preferences.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Convient à :</span> {recipe.preferences.join(', ')}
          </div>
        )}
        {onReplace && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Remplacer ce plat</h4>
            <RecipeReplaceSelector
              recipes={recipes}
              currentRecipe={recipe}
              onSelect={alt => {
                onReplace(alt);
                onClose();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
