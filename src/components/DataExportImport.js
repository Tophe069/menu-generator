import React, { useRef } from 'react';

export default function DataExportImport({ userProfile, weeklyMenu, shoppingList, onImport }) {
  const fileRef = useRef();

  // Exporte les données courantes dans un fichier JSON
  function handleExport() {
    const data = {
      userProfile,
      weeklyMenu,
      shoppingList,
      date: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-generator-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importe un fichier JSON et transmet les données au parent
  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.userProfile && data.weeklyMenu && data.shoppingList) {
          onImport(data);
        } else {
          alert('Fichier invalide.');
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="bg-white rounded shadow p-6 mb-6 flex flex-col md:flex-row gap-4 items-center">
      <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow" onClick={handleExport}>
        Exporter mes données
      </button>
      <div>
        <input
          type="file"
          accept="application/json"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
          onClick={() => fileRef.current && fileRef.current.click()}
        >
          Importer un fichier
        </button>
      </div>
    </div>
  );
}
