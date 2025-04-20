import React, { useState } from 'react';

export default function UserProfileForm({ onSave }) {
  const [form, setForm] = useState({
    age: '',
    sexe: '',
    taille: '',
    poids: '',
    activite: '',
    allergies: '',
    intolerances: '',
    preferences: '',
    objectifCalories: '',
    objectifProteines: '',
    objectifGlucides: '',
    objectifLipides: '',
    objectifCalcium: '',
    objectifFer: '',
    petitDejType: 'sucre',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-medium">Âge</label>
        <input type="number" name="age" min="1" max="120" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Sexe</label>
        <select name="sexe" value={form.sexe} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
          <option value="">Sélectionner</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Taille (cm)</label>
        <input type="number" name="taille" min="50" max="250" value={form.taille} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Poids (kg)</label>
        <input type="number" name="poids" min="20" max="250" value={form.poids} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Type de petit-déjeuner</label>
        <select name="petitDejType" value={form.petitDejType} onChange={handleChange} className="w-full px-3 py-2 border rounded">
          <option value="sucre">Sucré</option>
          <option value="sale">Salé</option>
          <option value="alterne">Alterné (sucré/salé)</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Niveau d'activité</label>
        <select name="activite" value={form.activite} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
          <option value="">Sélectionner</option>
          <option value="sedentaire">Sédentaire</option>
          <option value="leger">Légère activité</option>
          <option value="modere">Activité modérée</option>
          <option value="intense">Activité intense</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Allergies (ex : arachides, œufs...)</label>
        <input type="text" name="allergies" value={form.allergies} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Séparez par des virgules" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Objectifs nutritionnels</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-xs">Calories (kcal/jour)</label>
            <input type="number" name="objectifCalories" value={form.objectifCalories} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-xs">Protéines (g/jour)</label>
            <input type="number" name="objectifProteines" value={form.objectifProteines} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-xs">Glucides (g/jour)</label>
            <input type="number" name="objectifGlucides" value={form.objectifGlucides} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-xs">Lipides (g/jour)</label>
            <input type="number" name="objectifLipides" value={form.objectifLipides} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-xs">Calcium (mg/jour)</label>
            <input type="number" name="objectifCalcium" value={form.objectifCalcium} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-xs">Fer (mg/jour)</label>
            <input type="number" name="objectifFer" value={form.objectifFer} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Intolérances (ex : lactose, gluten...)</label>
        <input type="text" name="intolerances" value={form.intolerances} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Séparez par des virgules" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Préférences alimentaires</label>
        <select name="preferences" value={form.preferences} onChange={handleChange} className="w-full px-3 py-2 border rounded">
          <option value="">Aucune</option>
          <option value="vegetarien">Végétarien</option>
          <option value="vegan">Vegan</option>
          <option value="halal">Halal</option>
          <option value="casher">Casher</option>
          <option value="sansporc">Sans porc</option>
        </select>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">Enregistrer</button>
      </div>
    </form>
  );
}
