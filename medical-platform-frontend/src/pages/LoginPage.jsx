import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: identifiant,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Erreur de connexion');
        return;
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      const userResponse = await fetch('http://127.0.0.1:8000/api/auth/user/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access}`,
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setError('Impossible de récupérer les informations utilisateur');
        return;
      }

      const role = userData.role.toLowerCase();

      if (role === 'patient') {
        localStorage.setItem('role', 'patient');
        navigate('/patient');
      } else if (role === 'medecin') {
        localStorage.setItem('role', 'medecin');
        navigate('/medecin');
      } else if (role === 'pharmacien' || role === 'pharmacie') {
        localStorage.setItem('role', 'pharmacie');
        navigate('/pharmacie');
      } else {
        setError('Rôle inconnu');
      }

    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la connexion au serveur.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        {/* Logo + Titre */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-20 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">Connectez-vous ou créez votre compte</h1>
          <p className="text-gray-500 text-sm mt-2">Renseignez votre identifiant et mot de passe</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
            <input
              type="text"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              placeholder="Votre Identifiant"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-cyan-600 transition"
              tabIndex={-1}
            >
              {showPassword ? '' : ''}
            </button>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-cyan-600 hover:underline">Mot de passe oublié</a>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Se connecter
          </button>
        </form>

        {/* Lien vers création de compte */}
        <div className="mt-6 bg-cyan-50 rounded-lg p-4 text-center text-sm text-gray-700">
          <p className="mb-1">Pas encore de compte ?</p>
          <Link to="/register" className="text-cyan-700 font-semibold hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
