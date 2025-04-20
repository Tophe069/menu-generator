// Calcul d’un indice nutritionnel simple sur 10
export default function getNutritionScore(recipe) {
  let score = 5;
  if (!recipe || !recipe.macros) return 0;
  const { proteines, lipides, glucides } = recipe.macros;
  const { calcium = 0, fer = 0 } = recipe.micronutrients || {};
  // Protéines >15g : +1
  if (proteines >= 15) score++;
  // Lipides <25g : +1, >35g : -1
  if (lipides < 25) score++; else if (lipides > 35) score--;
  // Glucides entre 40 et 80g : +1
  if (glucides >= 40 && glucides <= 80) score++;
  // Calcium >80mg : +1
  if (calcium > 80) score++;
  // Fer >2mg : +1
  if (fer > 2) score++;
  // Variété de légumes : +1 si plus de 2 légumes différents
  const legumes = ['légume', 'carotte', 'tomate', 'concombre', 'brocolis', 'poivron', 'courgette', 'haricot', 'salade', 'épinard', 'aubergine', 'chou', 'petit pois'];
  let ingredients = recipe.ingredientsDetails ? recipe.ingredientsDetails.map(i => i.nom) : recipe.ingredients;
  let foundLegumes = legumes.filter(l => ingredients.some(i => i && i.toLowerCase().includes(l)));
  if (foundLegumes.length > 2) score++;
  // Clamp
  if (score > 10) score = 10;
  if (score < 0) score = 0;
  return score;
}
