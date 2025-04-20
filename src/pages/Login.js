import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call for authentication
    if (email && password) {
      // Simulated login success
      navigate('/dashboard');
    } else {
      setError('Veuillez remplir tous les champs.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Connexion</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mot de passe</label>
            <input type="password" className="w-full px-3 py-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">Se connecter</button>
        </form>
        <div className="mt-4 text-center">
          <span>Pas encore de compte ? </span>
          <Link to="/signup" className="text-indigo-700 hover:underline">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
