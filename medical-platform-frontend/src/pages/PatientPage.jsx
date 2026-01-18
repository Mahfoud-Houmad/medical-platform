import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PatientPage() {
  const [allMedicaments, setAllMedicaments] = useState([]);
  const [searchTerms, setSearchTerms] = useState(['']);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [ordonnances, setOrdonnances] = useState([]);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/medicaments/')
      .then(res => res.json())
      .then(data => setAllMedicaments(data));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/ordonnances/patient/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrdonnances(data));
  }, []);

  const handleInputChange = (value, index) => {
    const updated = [...searchTerms];
    updated[index] = value;
    setSearchTerms(updated);

    if (value.trim()) {
      const filtered = allMedicaments.filter(med =>
        `${med.nom} ${med.dosage}`.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion, index) => {
    const updated = [...searchTerms];
    updated[index] = `${suggestion.nom} ${suggestion.dosage}`;
    setSearchTerms(updated);
    setSuggestions([]);
  };

  const handleAddInput = () => {
    setSearchTerms([...searchTerms, '']);
  };

  const handleSearchFromOrdonnance = (ordonnance) => {
  const meds = ordonnance.medicaments.map(m => `${m.nom} ${m.dosage}`);
  setSearchTerms(meds);
  setTimeout(() => handleSearch(), 100); // attendre que le champ soit mis à jour
};


  const handleSearch = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/medicaments/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ medicaments: searchTerms.filter(t => t.trim() !== '') })
    });

    if (res.ok) {
      const data = await res.json();
      setResults(data);
    } else {
      alert('Erreur de recherche');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Message d’accueil */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Bonjour </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Bienvenue dans votre espace patient. Recherchez vos médicaments, consultez vos e-ordonnances et trouvez les pharmacies près de chez vous !
          </p>
        </div>

        {/* Recherche */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-cyan-700 mb-4">🔍 Recherche de médicaments</h3>

          {searchTerms.map((term, index) => (
            <div key={index} className="mb-3 relative">
              <input
                type="text"
                value={term}
                onChange={(e) => handleInputChange(e.target.value, index)}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Ex: Doliprane 500mg"
              />
              {suggestions.length > 0 && index === searchTerms.length - 1 && (
                <ul className="bg-white border rounded shadow mt-1 absolute z-10 w-full">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectSuggestion(s, index)}
                    >
                      {s.nom} - {s.dosage}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            onClick={handleAddInput}
            className="text-sm text-cyan-600 hover:underline mb-4 flex items-center"
          >
            ➕ Ajouter un médicament
          </button>

          <button
            onClick={handleSearch}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Lancer la recherche
          </button>
        </div>

        {/* Résultats de recherche */}
        <div className="mb-14">
          <h3 className="text-2xl font-bold text-cyan-700 mb-4">🏥 Pharmacies disponibles</h3>
          {results.length > 0 ? (
            results.map((pharmacie, idx) => (
              <div key={idx} className="mb-6 p-5 bg-white rounded-lg shadow-lg">
                <div className="flex items-center mb-3 gap-4">
                  <img
                    src="/assets/pharmacy-logo.png"
                    alt="Pharmacie"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-bold text-gray-800">{pharmacie.pharmacie}</p>
                    <p className="text-sm text-gray-500">{pharmacie.address}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  📍 Lien Maps :{' '}
                  <a
                    href={pharmacie.google_maps_link}
                    className="text-cyan-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir sur Google Maps
                  </a>
                </div>
                <div className="text-sm text-gray-700">
                  💊 Médicaments trouvés :{' '}
                  <span className="font-medium text-gray-800">
                    {pharmacie.medicaments_disponibles.join(', ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">Aucun résultat pour le moment.</p>
          )}
        </div>

        {/* E-ordonnances */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-cyan-700 mb-4">📋 Mes e-ordonnances</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {ordonnances.length > 0 ? (
              ordonnances.map(ord => (
                <div key={ord.id} className="bg-white p-5 rounded-xl shadow-md">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">🩺 Dr. {ord.nom_med}</h4>
                  <p className="text-sm text-gray-500 mb-2">📅 {new Date(ord.date_creation).toLocaleDateString()}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
  {ord.medicaments.map(m => (
    <li key={m.id}>
      {m.nom} - {m.dosage} ({m.duree_traitement} jours)
    </li>
  ))}
</ul>
<button
  onClick={() => handleSearchFromOrdonnance(ord)}
  className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-2 rounded transition"
>
  🔍 Chercher ces médicaments
</button>

                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">Aucune ordonnance trouvée.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PatientPage;
