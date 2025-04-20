import React, { useState } from 'react';

export default function MealTodoList({ dayIdx, mealType, todos, onChange }) {
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onChange([...(todos || []), { text: input, done: false, remind: false }]);
      setInput('');
    }
  };

  const toggleTodo = idx => {
    const updated = todos.map((t, i) => i === idx ? { ...t, done: !t.done } : t);
    onChange(updated);
  };

  const removeTodo = idx => {
    const updated = todos.filter((_, i) => i !== idx);
    onChange(updated);
  };

  // Gestion des rappels/notifications
  function toggleRemind(idx) {
    const updated = todos.map((t, i) => i === idx ? { ...t, remind: !t.remind } : t);
    onChange(updated);
    if (!todos[idx].remind) {
      // Demande permission et notifie
      if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification('Rappel programmé', {
              body: `Rappel pour la tâche : ${todos[idx].text}`,
            });
          }
        });
      }
    }
  }

  return (
    <div className="my-2">
      <h4 className="font-semibold mb-2">Tâches pour ce repas</h4>
      <form onSubmit={addTodo} className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 px-2 py-1 border rounded"
          placeholder="Ajouter une tâche (ex : préparer la veille, sortir du congélateur...)"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white px-3 rounded">Ajouter</button>
      </form>
      <ul>
        {(todos || []).map((todo, idx) => (
          <li key={idx} className="flex items-center gap-2 mb-1">
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(idx)} />
            <span className={todo.done ? 'line-through text-gray-400' : ''}>{todo.text}</span>
            <label className="flex items-center gap-1 ml-2 text-xs">
              <input type="checkbox" checked={todo.remind || false} onChange={() => toggleRemind(idx)} />
              Me rappeler
            </label>
            <button className="text-xs text-red-500 hover:underline" onClick={() => removeTodo(idx)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
