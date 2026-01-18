import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MedecinPage() {
  const [cin, setCin] = useState('');
  const [patient, setPatient] = useState(null);
  const [medicaments, setMedicaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);
  const [duration, setDuration] = useState({});
  const [success, setSuccess] = useState(false);
  const [ordonnances, setOrdonnances] = useState([]);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/medicaments/')
      .then(res => res.json())
      .then(data => setMedicaments(data));
  }, []);

  const handleSearch = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/auth/patient/${cin}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setPatient(data);
      fetchOrdonnances(data.id);
    } else {
      alert("Patient introuvable");
      setPatient(null);
      setOrdonnances([]);
    }
  };

  const fetchOrdonnances = async (patientId) => {
    const res = await fetch('http://127.0.0.1:8000/api/ordonnances/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const filtered = data.filter(o => o.patient === patientId);
    setOrdonnances(filtered);
  };
  const handleRemove = (medId) => {
  setSelected(selected.filter(id => id !== medId));
  const updated = { ...duration };
  delete updated[medId];
  setDuration(updated);
};



  const handleAdd = (medId) => {
    if (!selected.includes(medId)) {
      setSelected([...selected, medId]);
      setDuration({ ...duration, [medId]: 1 });
    }
  };

  const handleCreateOrdonnance = async () => {
    const body = {
      patient_cin: cin,
      medicaments: selected.map(id => ({
        medicament_id: id,
        duree_traitement: duration[id]
      }))
    };

    const res = await fetch('http://127.0.0.1:8000/api/ordonnances/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setSuccess(true);
      setSelected([]);
      setDuration({});
      fetchOrdonnances(patient.id);
    } else {
      alert("Erreur lors de la création de l'ordonnance");
    }
  };

  const filteredMedicaments = medicaments.filter(med =>
    med.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <div className="p-6 max-w-5xl flex-grow mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Bienvenue dans votre espace professionnel.
        </h2>
        <p className='text-center'> Recherchez un patient, prescrivez des médicaments en toute simplicité, et gérez vos e-ordonnances en toute sécurité.</p>

        {/* Recherche patient */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-cyan-700 mb-4">🔍 Rechercher un patient</h3>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="CIN du patient"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              className="border px-4 py-2 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleSearch}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg"
            >
              Rechercher
            </button>
          </div>

          {patient && (
            <div className="mt-4 text-sm text-gray-700">
              <p><strong>👤 Patient :</strong> {patient.username}</p>
              <p><strong>🆔 CIN :</strong> {patient.cin}</p>
            </div>
          )}
        </div>

        {/* Création d’ordonnance */}
        {patient && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-cyan-700 mb-4">💊 Ajouter des médicaments à l’ordonnance</h3>

            <input
              type="text"
              placeholder="🔍 Chercher un médicament par nom ou dosage"
              className="border px-4 py-2 mb-4 w-full rounded-lg focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul className="space-y-2 text-sm">
              {filteredMedicaments.map(med => (
                <li key={med.id} className="flex justify-between items-center bg-cyan-50 px-4 py-2 rounded">
                  <span>{med.nom} - {med.dosage}</span>
                  {!selected.includes(med.id) ? (
                    <button
                      className="text-green-600 hover:underline text-sm"
                      onClick={() => handleAdd(med.id)}
                    >Ajouter</button>
                  ) : (
                    <div className="flex items-center gap-2">
  <input
    type="number"
    className="border px-2 py-1 w-24 rounded focus:ring-1 focus:ring-cyan-500"
    value={duration[med.id] || 1}
    onChange={(e) => setDuration({ ...duration, [med.id]: parseInt(e.target.value) })}
    placeholder="Durée (jours)"
  />
  <button
    onClick={() => handleRemove(med.id)}
    className="text-red-600 hover:text-red-800 text-sm"
  >
    retirer
  </button>
</div>

                  )}
                </li>
              ))}
            </ul>

            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              onClick={handleCreateOrdonnance}
              disabled={selected.length === 0}
            >
              ✅ Créer l’ordonnance
            </button>

            {success && (
              <p className="text-green-600 mt-3 text-sm">✔️ Ordonnance créée avec succès.</p>
            )}
          </div>
        )}

        {/* Ordonnances existantes */}
        {ordonnances.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="text-xl font-semibold text-cyan-700 mb-4">📋 Ordonnances précédentes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {ordonnances.map(o => (
                <div key={o.id} className="bg-cyan-50 p-4 rounded shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">📅 {new Date(o.date_creation).toLocaleDateString()}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {o.medicaments.map(m => (
                      <li key={m.id}>{m.nom} - {m.dosage} : {m.duree_traitement} jours</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer className='mt-200'/>
    </div>
  );
}

export default MedecinPage;
