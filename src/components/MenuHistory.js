import React, { useState, useEffect } from 'react';

export default function MenuHistory({ onRestore }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('menuHistory') || '[]');
    setHistory(h);
  }, []);

  const handleRestore = (entry) => {
    if (onRestore) onRestore(entry.menu, entry.profile);
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Historique des menus</h3>
        {history.length > 0 && (
          <>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 mr-2"
              onClick={() => {
                const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'historique-menus.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Exporter tout
            </button>
            <label className="inline-block cursor-pointer px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
              Importer
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = evt => {
                    try {
                      const imported = JSON.parse(evt.target.result);
                      if (!Array.isArray(imported)) throw new Error('Format invalide');
                      // Fusionner sans doublons (par date)
                      const dates = new Set(history.map(h => h.date));
                      const merged = [...history];
                      imported.forEach(entry => {
                        if (!dates.has(entry.date)) merged.push(entry);
                      });
                      setHistory(merged);
                      localStorage.setItem('menuHistory', JSON.stringify(merged));
                      alert('Historique importé avec succès !');
                    } catch {
                      alert('Fichier invalide.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-gray-500">Aucun menu enregistré pour le moment.</div>
      ) : (
        <ul className="divide-y">
          {history.map((entry, idx) => (
            <li key={idx} className="py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="ml-2 text-xs text-gray-500">({entry.menu.length} jours)</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                    onClick={() => handleRestore(entry)}
                  >
                    Restaurer
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    onClick={() => {
                      const data = btoa(unescape(encodeURIComponent(JSON.stringify(entry))));
                      const url = `${window.location.origin}${window.location.pathname}?sharedMenu=${data}`;
                      navigator.clipboard.writeText(url);
                      alert('Lien de partage copié dans le presse-papiers !');
                    }}
                  >
                    Partager
                  </button>
                  <button
                    className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 text-xs"
                    onClick={() => {
                      // Générer la liste de courses texte
                      const shoppingList = (entry.shoppingList || entry.menu?.shoppingList || []);
                      let listText = '';
                      if (Array.isArray(shoppingList)) {
                        listText = shoppingList.join('\n');
                      } else if (typeof shoppingList === 'object') {
                        listText = Object.keys(shoppingList).map(k => `- ${k}`).join('\n');
                      } else {
                        listText = String(shoppingList);
                      }
                      navigator.clipboard.writeText(`Liste de courses pour la semaine :\n${listText}`);
                      alert('Liste de courses copiée dans le presse-papiers !');
                    }}
                  >
                    Partager liste de courses
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                    onClick={() => setHistory(h => h.map((e, i) => i === idx ? { ...e, showDetails: !e.showDetails } : e))}
                  >
                    {entry.showDetails ? 'Masquer détails' : 'Détails'}
                  </button>
                </div>
              </div>
              {entry.showDetails && (
                <div className="mt-2">
                  {entry.menu.map((day, i) => (
                    <MenuEntryDetails key={i} day={`Jour ${i + 1}`} data={day} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
