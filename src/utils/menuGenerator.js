import recipes from '../data/recipes';

/**
 * Génère un menu hebdomadaire personnalisé.
 * @param {Object} userProfile - Profil utilisateur (besoin calorique, préférences, allergies...)
 * @returns {Array} menu - Tableau de 7 jours, chaque jour contient petit-dej, déjeuner, dîner
 */
export function generateWeeklyMenu(userProfile) {
  // Filtrage selon préférences, allergies, intolérances
  // Pour déj/diner : doit contenir légume, féculent, viande/poisson
  const isMainBalanced = (r) => {
    const legumes = ['légume', 'carotte', 'tomate', 'concombre', 'brocolis', 'poivron', 'courgette', 'haricot', 'salade', 'épinard', 'aubergine', 'chou', 'petit pois'];
    const feculents = ['riz', 'pâtes', 'pomme de terre', 'quinoa', 'pain', 'blé', 'semoule', 'lentilles', 'pois chiches', 'patate', 'céréale', 'boulgour'];
    const viandes = ['poulet', 'boeuf', 'dinde', 'jambon', 'porc', 'veau', 'agneau'];
    const poissons = ['poisson', 'saumon', 'thon', 'cabillaud', 'colin', 'maquereau', 'sardine'];
    // Compter le nombre de légumes différents présents
    const foundLegumes = legumes.filter(l => r.ingredients.some(i => i.toLowerCase().includes(l)));
    const hasTwoLegumes = foundLegumes.length >= 2;
    const hasFeculent = r.ingredients.some(i => feculents.some(f => i.toLowerCase().includes(f)));
    const hasViandePoisson = r.ingredients.some(i => viandes.some(v => i.toLowerCase().includes(v)) || poissons.some(p => i.toLowerCase().includes(p)));
    return hasTwoLegumes && hasFeculent && hasViandePoisson;
  };


  // Pour petit-déjeuner : sucré/salé
  const isSucre = r => ['sucre', 'miel', 'confiture', 'chocolat', 'banane', 'fruit', 'compote', 'sirop', 'pomme', 'poire', 'abricot', 'orange'].some(s => r.ingredients.some(i => i.toLowerCase().includes(s)));
  const isSale = r => ['oeuf', 'fromage', 'jambon', 'bacon', 'saumon', 'avocat', 'beurre', 'lard', 'tomate', 'champignon'].some(s => r.ingredients.some(i => i.toLowerCase().includes(s)));

  const filterRecipe = (type, opts = {}) => {
    return recipes.filter(r =>
      r.type === type &&
      (!userProfile.preferences || r.preferences.includes(userProfile.preferences) || r.preferences.includes('')) &&
      (!userProfile.allergies || !r.allergens.some(a => userProfile.allergies.toLowerCase().includes(a))) &&
      (!userProfile.intolerances || !r.intolerances.some(i => userProfile.intolerances.toLowerCase().includes(i))) &&
      (
        (type === 'dejeuner' || type === 'diner') ? isMainBalanced(r) :
        (type === 'petit-dejeuner' && opts.petitDejType === 'sucre' ? isSucre(r) :
         type === 'petit-dejeuner' && opts.petitDejType === 'sale' ? isSale(r) :
         type === 'petit-dejeuner' && opts.petitDejType === 'alterne' ? (opts.alterneSucre ? isSucre(r) : isSale(r)) : true)
      )
    );
  };

  // Objectif calorique par repas (approximatif)
  const dailyCalories = userProfile.besoinCalorique || 2000;
  const breakfastTarget = Math.round(dailyCalories * 0.25);
  const lunchTarget = Math.round(dailyCalories * 0.4);
  const dinnerTarget = Math.round(dailyCalories * 0.35);

  // Pour chaque jour, sélectionner aléatoirement une recette adaptée
  const petitDejType = userProfile.petitDejType || 'sucre';
  let alterneSucre = true;
  const menu = Array.from({ length: 7 }).map((_, idx) => {
    let pdType = petitDejType;
    if (petitDejType === 'alterne') {
      pdType = alterneSucre ? 'sucre' : 'sale';
      alterneSucre = !alterneSucre;
    }
    const petitDej = pickRecipe(filterRecipe('petit-dejeuner', { petitDejType: pdType, alterneSucre }), breakfastTarget);
    const dejeuner = pickRecipe(filterRecipe('dejeuner'), lunchTarget);
    const diner = pickRecipe(filterRecipe('diner'), dinnerTarget);
    return {
      petitDej,
      dejeuner,
      diner,
    };
  });
  return menu;
}

function pickRecipe(recipesList, targetCalories) {
  // Prend la recette la plus proche du besoin calorique, sinon au hasard
  if (!recipesList.length) return null;
  let closest = recipesList[0];
  let minDiff = Math.abs(recipesList[0].calories - targetCalories);
  for (let r of recipesList) {
    const diff = Math.abs(r.calories - targetCalories);
    if (diff < minDiff) {
      closest = r;
      minDiff = diff;
    }
  }
  return closest;
}
