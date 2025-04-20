import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">Menu Generator</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-xl text-center">
        Générez des menus personnalisés sur 7 jours selon vos critères : âge, sexe, taille, poids, activité, préférences alimentaires. Suivi des nutriments, export PDF, calendrier, todolist, et plus encore !
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">Connexion</Link>
        <Link to="/signup" className="px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 font-semibold">Créer un compte</Link>
      </div>
    </div>
  );
}
