/**
 * Gestion basique de l'historique des menus (localStorage)
 */
export function saveMenuToHistory(menu, profile) {
  const history = JSON.parse(localStorage.getItem('menuHistory') || '[]');
  const entry = {
    date: new Date().toISOString(),
    menu,
    profile,
  };
  history.unshift(entry);
  localStorage.setItem('menuHistory', JSON.stringify(history.slice(0, 10)));
}

export function getMenuHistory() {
  return JSON.parse(localStorage.getItem('menuHistory') || '[]');
}
