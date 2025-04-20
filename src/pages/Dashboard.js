import React, { useState } from 'react';
import UserProfileForm from '../components/UserProfileForm';
import { generateWeeklyMenu } from '../utils/menuGenerator';
import RecipeDetailsModal from '../components/RecipeDetailsModal';
import { generateShoppingList } from '../utils/shoppingListGenerator';
import PdfExportButton from '../components/PdfExportButton';
import { saveMenuToHistory, getMenuHistory } from '../utils/historyManager';
import MealCalendar from '../components/MealCalendar';
import NutritionSummaryTable from '../components/NutritionSummaryTable';
import NutritionCharts from '../components/NutritionCharts';
import MicronutrientCharts from '../components/MicronutrientCharts';
import DataExportImport from '../components/DataExportImport';
import MenuHistory from '../components/MenuHistory';
import MealTodoList from '../components/MealTodoList';

export default function Dashboard() {
  const [showImportPrompt, setShowImportPrompt] = React.useState(false);
  const [sharedMenuData, setSharedMenuData] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('sharedMenu');
    if (shared) {
      try {
        const json = decodeURIComponent(escape(atob(shared)));
        const entry = JSON.parse(json);
        setSharedMenuData(entry);
        setShowImportPrompt(true);
      } catch {}
    }
  }, []);

  // Gestion todolists repas (par jour/repas)
  function getMealTodos(dayIdx, mealType) {
    const all = JSON.parse(localStorage.getItem('mealTodos') || '{}');
    return all[`${dayIdx}_${mealType}`] || [];
  }
  function setMealTodos(dayIdx, mealType, todos) {
    const all = JSON.parse(localStorage.getItem('mealTodos') || '{}');
    all[`${dayIdx}_${mealType}`] = todos;
    localStorage.setItem('mealTodos', JSON.stringify(all));
  }

  const [userProfile, setUserProfile] = useState(null);
  const [weeklyMenu, setWeeklyMenu] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [menuHistory, setMenuHistory] = useState(() => getMenuHistory());


  // Génère le menu si userProfile change
  const handleSaveProfile = (profile) => {
    // Calcul besoin calorique (pour transmission à l'algo)
    const tailleM = Number(profile.taille) / 100;
    const poids = Number(profile.poids);
    const age = Number(profile.age);
    let bmr = 0;
    if (profile.sexe === 'homme') {
      bmr = 10 * poids + 6.25 * Number(profile.taille) - 5 * age + 5;
    } else if (profile.sexe === 'femme') {
      bmr = 10 * poids + 6.25 * Number(profile.taille) - 5 * age - 161;
    }
    let facteur = 1.2;
    switch (profile.activite) {
      case 'sedentaire': facteur = 1.2; break;
      case 'leger': facteur = 1.375; break;
      case 'modere': facteur = 1.55; break;
      case 'intense': facteur = 1.725; break;
      default: break;
    }
    const besoinCalorique = bmr ? Math.round(bmr * facteur) : 2000;
    const fullProfile = { ...profile, besoinCalorique };
    setUserProfile(fullProfile);
    const menu = generateWeeklyMenu(fullProfile);
    setWeeklyMenu(menu);
    setShoppingList(generateShoppingList(menu));
    saveMenuToHistory(menu, fullProfile);
    setMenuHistory(getMenuHistory());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="w-full mb-6 rounded-lg overflow-hidden shadow">
          <img
            src={process.env.PUBLIC_URL + '/bandeau-aliments.jpg'}
            alt="Bandeau aliments frais et sains"
            className="w-full h-48 object-cover object-center"
            style={{maxHeight:'220px'}}
          />
        </div>

        {userProfile && weeklyMenu && shoppingList && (
          <PdfExportButton userProfile={userProfile} weeklyMenu={weeklyMenu} shoppingList={shoppingList} />
        )}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Tableau de bord</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenue sur votre générateur de menus !</h2>
          <p className="mb-2">Remplissez vos informations pour obtenir des menus adaptés à vos besoins nutritionnels.</p>
        </div>
        {showImportPrompt && sharedMenuData && (
          <div className="mb-4 bg-blue-100 border border-blue-300 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-2 md:mb-0">
              <b>Menu partagé détecté !</b> Voulez-vous l’importer dans votre historique ou le restaurer ?
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                onClick={() => {
                  // Ajouter à l’historique
                  const history = JSON.parse(localStorage.getItem('menuHistory') || '[]');
                  if (!history.some(h => h.date === sharedMenuData.date)) {
                    history.unshift(sharedMenuData);
                    localStorage.setItem('menuHistory', JSON.stringify(history));
                  }
                  setShowImportPrompt(false);
                  alert('Menu importé dans l’historique !');
                }}
              >
                Importer dans l’historique
              </button>
              <button
                className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                onClick={() => {
                  setUserProfile(sharedMenuData.profile);
                  setWeeklyMenu(sharedMenuData.menu);
                  setShowImportPrompt(false);
                  alert('Menu restauré !');
                }}
              >
                Restaurer directement
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                onClick={() => setShowImportPrompt(false)}
              >
                Ignorer
              </button>
            </div>
          </div>
        )}
        <NotificationsSettings />
        <div className="container mx-auto max-w-5xl py-6 px-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  <span className="font-semibold">IMC&nbsp;: </span>
                  <span>{imc}</span>
                </div>
                <div>
                  <span className="font-semibold">Besoin calorique journalier&nbsp;: </span>
                  <span>{besoinCalorique} kcal</span>
                </div>
              </div>
            </div>
          );
        })()}

        {weeklyMenu && (
          <MealCalendar
            weeklyMenu={weeklyMenu}
            onSelectMeal={(recipe, dayIdx, mealType) => setSelectedRecipe({ recipe, dayIdx, mealType })}
          />
        )}
        {selectedRecipe && (
          <div>
            <RecipeDetailsModal
              recipe={selectedRecipe.recipe}
              onClose={() => setSelectedRecipe(null)}
              onReplace={alt => {
                setWeeklyMenu(prevMenu => {
                  // Remplace la recette dans le menu (jour + type)
                  return prevMenu.map((day, idx) => {
                    if (idx === selectedRecipe.dayIdx) {
                      return {
                        ...day,
                        [selectedRecipe.mealType]: alt,
                      };
                    }
                    return day;
                  });
                });
              }}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="absolute top-64 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-auto">
                <MealTodoList
                  dayIdx={selectedRecipe.dayIdx}
                  mealType={selectedRecipe.mealType}
                  todos={getMealTodos(selectedRecipe.dayIdx, selectedRecipe.mealType)}
                  onChange={todos => setMealTodos(selectedRecipe.dayIdx, selectedRecipe.mealType, todos)}
                />
              </div>
            </div>
          </div>
        )}
        {shoppingList && (
          <div className="bg-white rounded shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Liste d'achats pour la semaine</h3>
            <ul className="list-disc pl-6 text-gray-800">
              {Object.entries(shoppingList.ingredients).map(([ing, count]) => (
                <li key={ing} className="mb-1">
                  <span className="font-semibold">{ing}</span> <span className="text-gray-500">x{count}</span>
                  <span className="text-xs text-gray-400 ml-2">({shoppingList.details[ing].join(', ')})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {menuHistory.length > 0 && (
          <div className="bg-white rounded shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Historique des menus générés</h3>
            <ul className="divide-y">
              {menuHistory.map((entry, idx) => (
                <li key={entry.date} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</span>
                    <span className="ml-2">{entry.profile.age} ans, {entry.profile.sexe}, {entry.profile.activite}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                      onClick={() => {
                        setUserProfile(entry.profile);
                        setWeeklyMenu(entry.menu);
                        setShoppingList(generateShoppingList(entry.menu));
                      }}
                    >Restaurer</button>
                    <button
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      onClick={() => {
                        const newHistory = menuHistory.filter((_, i) => i !== idx);
                        localStorage.setItem('menuHistory', JSON.stringify(newHistory));
                        setMenuHistory(newHistory);
                      }}
                    >Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {weeklyMenu && (
          <>
            <NutritionSummaryTable weeklyMenu={weeklyMenu} userProfile={userProfile} />
            <NutritionCharts weeklyMenu={weeklyMenu} userProfile={userProfile} />
            <MicronutrientCharts weeklyMenu={weeklyMenu} userProfile={userProfile} />
          </>
        )}
        <MenuHistory
          onRestore={(menu, profile) => {
            setWeeklyMenu(menu);
            setUserProfile(profile);
          }}
        />
        <GoogleDriveSync
          historyData={menuHistory}
          onImport={json => {
            if (Array.isArray(json)) {
              // Fusionne sans doublons
              const dates = new Set(menuHistory.map(h => h.date));
              const merged = [...menuHistory];
              json.forEach(entry => {
                if (!dates.has(entry.date)) merged.push(entry);
              });
              setMenuHistory(merged);
              localStorage.setItem('menuHistory', JSON.stringify(merged));
            } else {
              alert('Format de fichier invalide.');
            }
          }}
        />
        <DataExportImport
          userProfile={userProfile}
          weeklyMenu={weeklyMenu}
          shoppingList={shoppingList}
          onImport={data => {
            setUserProfile(data.userProfile);
            setWeeklyMenu(data.weeklyMenu);
            setShoppingList(data.shoppingList);
          }}
        />
        {/* Les futures sections (menus générés, historique, etc.) seront ajoutées ici */}
      </div>
    </div>
  );
}
