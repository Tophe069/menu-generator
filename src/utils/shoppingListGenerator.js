/**
 * Génère une liste d'achats unique à partir du menu hebdomadaire.
 * @param {Array} weeklyMenu - Tableau de 7 jours, chaque jour contient petitDej, dejeuner, diner (recettes)
 * @returns {Object} { ingredients: { [ingredient]: count }, details: { [ingredient]: [jours, repas] } }
 */
export function generateShoppingList(weeklyMenu) {
  const ingredients = {};
  const details = {};
  weeklyMenu.forEach((day, dayIdx) => {
    ['petitDej', 'dejeuner', 'diner'].forEach(mealType => {
      const recipe = day[mealType];
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          if (!ingredients[ing]) ingredients[ing] = 0;
          ingredients[ing] += 1;
          if (!details[ing]) details[ing] = [];
          details[ing].push(`Jour ${dayIdx + 1} (${mealType})`);
        });
      }
    });
  });
  return { ingredients, details };
}
