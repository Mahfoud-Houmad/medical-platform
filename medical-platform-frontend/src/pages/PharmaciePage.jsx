import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PharmaciePage() {
  const [medicaments, setMedicaments] = useState([]);
  const [selectedMedicament, setSelectedMedicament] = useState('');
  const [quantite, setQuantite] = useState(0);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/auth/user/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserData(data);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/medicaments/')
      .then(res => res.json())
      .then(data => setMedicaments(data));
  }, []);

  useEffect(() => {
    if (!userData) return;
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/stocks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const array = Array.isArray(data) ? data : Object.values(data);
        const filtered = array.filter(item => item.pharmacie === userData.id);
        setStock(filtered);
        setLoading(false);
      });
  }, [userData]);

  const handleAddStock = async () => {
    const medicamentId = parseInt(selectedMedicament);
    const quantiteInt = parseInt(quantite);

    if (!medicamentId || isNaN(quantiteInt) || quantiteInt <= 0 || !userData) {
      alert("Veuillez sélectionner un médicament et entrer une quantité positive.");
      return;
    }

    const token = localStorage.getItem('access_token');
    const existing = stock.find(s => s.medicament === medicamentId);

    try {
      if (existing) {
        await fetch(`http://127.0.0.1:8000/api/stocks/${existing.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            pharmacie: userData.id,
            medicament: medicamentId,
            quantite: quantiteInt + existing.quantite,
          }),
        });
      } else {
        await fetch('http://127.0.0.1:8000/api/stocks/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            pharmacie: userData.id,
            medicament: medicamentId,
            quantite: quantiteInt,
          }),
        });
      }

      setQuantite(0);
      setSelectedMedicament('');

      const res = await fetch('http://127.0.0.1:8000/api/stocks/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const updated = await res.json();
      const array = Array.isArray(updated) ? updated : Object.values(updated);
      setStock(array.filter(item => item.pharmacie === userData.id));
      setLoading(false);

    } catch (error) {
      console.error("Erreur lors de l'ajout au stock :", error);
      alert("Une erreur est survenue lors de l'ajout.");
    }
  };

  const handleUpdateStock = async (stockItem) => {
    const token = localStorage.getItem('access_token');
    const updatedQuantite = parseInt(stockItem.editQuantite);

    if (isNaN(updatedQuantite) || updatedQuantite < 0) {
      alert("Quantité invalide.");
      return;
    }

    try {
      await fetch(`http://127.0.0.1:8000/api/stocks/${stockItem.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pharmacie: userData.id,
          medicament: stockItem.medicament,
          quantite: updatedQuantite,
        }),
      });

      const res = await fetch('http://127.0.0.1:8000/api/stocks/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const array = Array.isArray(data) ? data : Object.values(data);
      setStock(array.filter(item => item.pharmacie === userData.id));
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      alert("Échec de la modification.");
    }
  };

  const handleDeleteStock = async (stockId) => {
    const token = localStorage.getItem('access_token');
    await fetch(`http://127.0.0.1:8000/api/stocks/${stockId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const res = await fetch('http://127.0.0.1:8000/api/stocks/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    const array = Array.isArray(data) ? data : Object.values(data);
    setStock(array.filter(item => item.pharmacie === userData.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Bienvenue dans votre espace pharmacie 🧪</h2>
          <p className="text-gray-600 mt-2 text-lg">Gérez facilement votre stock de médicaments</p>
        </div>

        {/* Ajouter au stock */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h3 className="text-2xl font-semibold text-cyan-700 mb-4">➕ Ajouter un médicament</h3>
          <div className="flex flex-wrap items-center gap-4">
            <select
              className="border rounded-lg px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-cyan-500"
              value={selectedMedicament}
              onChange={(e) => setSelectedMedicament(e.target.value)}
            >
              <option value="">-- Choisir un médicament --</option>
              {medicaments.map((med) => (
                <option key={med.id} value={med.id}>
                  {`${med.nom} - ${med.dosage}`}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="border rounded-lg px-4 py-2 w-24 focus:ring-2 focus:ring-cyan-500"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
            />
            <button
              onClick={handleAddStock}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg transition"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Tableau de stock */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-semibold text-cyan-700 mb-4">📦 Stock actuel</h3>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-cyan-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Médicament</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Dosage</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Quantité</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.map(s => (
                    <tr key={s.id} className="border-t">
                      <td className="px-4 py-2">{s.medicament_nom}</td>
                      <td className="px-4 py-2">{s.medicament_dosage}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          className="w-20 border rounded px-2 py-1"
                          value={s.editQuantite ?? s.quantite}
                          onChange={(e) => {
                            const updatedStock = stock.map(item =>
                              item.id === s.id ? { ...item, editQuantite: parseInt(e.target.value) } : item
                            );
                            setStock(updatedStock);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="text-cyan-600 hover:text-cyan-800 text-sm"
                          onClick={() => handleUpdateStock(s)}
                        >
                          Modifier
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={() => handleDeleteStock(s.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PharmaciePage;
