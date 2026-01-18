import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import user from '../assets/user.png';

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/user/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération du profil');

        const data = await response.json();
        setUserData(data);
        setFormValues({
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } catch (error) {
        console.error(error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/user/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      if (res.ok) {
        setMessage('Modifications enregistrées avec succès ✅');
        setEditMode(false);
        const updated = await res.json();
        setUserData(updated);
      } else {
        const errData = await res.json();
        setMessage(errData.detail || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setMessage('Erreur de connexion au serveur.');
    }
  };

  if (!userData) {
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <div className="flex justify-center items-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src={user}
              alt="Profil"
              className="h-24 w-24 rounded-full border-4 border-cyan-500 shadow-md object-cover mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-800">Mon Profil</h2>
            <p className="text-gray-500 text-sm">Informations personnelles</p>
          </div>

          {message && (
            <div className="text-center mb-4 text-sm text-cyan-700 bg-cyan-100 px-4 py-2 rounded">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
            <div>
              <span className="font-semibold text-gray-800">Nom d'utilisateur :</span>
              <div>{userData.username}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Rôle :</span>
              <div>{userData.role}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Email :</span>
              {editMode ? (
                <input
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-1 rounded mt-1"
                />
              ) : (
                <div>{userData.email || 'Non renseigné'}</div>
              )}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Téléphone :</span>
              {editMode ? (
                <input
                  name="phone"
                  type="text"
                  value={formValues.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-1 rounded mt-1"
                />
              ) : (
                <div>{userData.phone || 'Non renseigné'}</div>
              )}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-gray-800">Adresse :</span>
              {editMode ? (
                <input
                  name="address"
                  type="text"
                  value={formValues.address}
                  onChange={handleChange}
                  className="w-full border px-3 py-1 rounded mt-1"
                />
              ) : (
                <div>{userData.address || 'Bd Nile'}</div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                >
                  Enregistrer
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
              >
                Modifier mon profil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
