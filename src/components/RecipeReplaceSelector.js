import React, { useState } from 'react';

export default function RecipeReplaceSelector({ recipes, onSelect, currentRecipe }) {
  const [filter, setFilter] = useState('');
  const filtered = recipes.filter(r =>
    r.id !== currentRecipe.id && r.type === currentRecipe.type && r.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="my-4">
      <input
        type="text"
        placeholder="Filtrer les recettes..."
        className="w-full px-3 py-2 border rounded mb-2"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="max-h-40 overflow-auto">
        {filtered.length ? (
          filtered.map(r => (
            <button
              key={r.id}
              className="block w-full text-left px-3 py-2 hover:bg-indigo-50 rounded"
              onClick={() => onSelect(r)}
            >
              {r.name}
            </button>
          ))
        ) : (
          <div className="text-gray-400 italic">Aucune alternative disponible</div>
        )}
      </div>
    </div>
  );
}
