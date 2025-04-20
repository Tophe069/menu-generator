// Utilitaires pour extraire les objectifs nutritionnels du profil utilisateur

export function getNutritionObjectives(userProfile) {
  return {
    calories: Number(userProfile.objectifCalories) || null,
    proteines: Number(userProfile.objectifProteines) || null,
    glucides: Number(userProfile.objectifGlucides) || null,
    lipides: Number(userProfile.objectifLipides) || null,
    calcium: Number(userProfile.objectifCalcium) || null,
    fer: Number(userProfile.objectifFer) || null,
  };
}
