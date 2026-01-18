import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
    cin: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const payload = {
      ...formData,
      inp: '',
      inpe: '',
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'patient',
          cin: '',
          phone: '',
          address: ''
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await res.json();
        setError(data.detail || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 pt-10">
      <div className="max-w-md mx-auto  bg-white p-8 rounded-2xl shadow-lg">
        {/* Titre + logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-20 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Créer un compte patient</h2>
          <p className="text-sm text-gray-500 mt-1">Remplissez les champs pour vous inscrire</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            Compte créé avec succès. Redirection...
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Nom d'utilisateur"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            name="cin"
            value={formData.cin}
            onChange={handleChange}
            required
            placeholder="CIN"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Téléphone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Adresse"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition font-semibold"
          >
            Créer mon compte
          </button>
        </form>

        {/* Lien vers connexion */}
        <div className="text-center text-sm mt-6 text-gray-700">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-cyan-700 font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
