import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import search from '../assets/search.png';
import ordonnance from '../assets/touch.png';
import uuuser from '../assets/add-friend.png';
import docteur from '../assets/doctor.png';
import pharma from '../assets/pharmacy.png';
import aduser from '../assets/add-user.png';
import logo from '../assets/logo.png';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
<header className="bg-[#0a2342] text-white sticky top-0 z-50 shadow-md">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <img src={logo} alt="Dawaii Logo" className="h-12 rounded-2xl" />
      <h1 className="text-2xl font-bold text-cyan-400">Dawaii</h1>
    </div>
    
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate('/')}
        className="text-sm hover:text-cyan-400"
      >
        Accueil
      </button>
      <button
        onClick={() => navigate('/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
      >
        🔐 Se connecter
      </button>
      <button
        onClick={() => navigate('/register')}
        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
      >
        📝 Créer un compte
      </button>
    </div>
  </div>
</header>


      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-center py-16 px-6 bg-blue-50">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">
            Bienvenue sur la Plateforme Médicale Dawaii
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Simplifiez vos soins de santé avec une interface intelligente et intuitive
          </p>
        </section>

        {/* Fonctionnalités */}
        <section className="py-16 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">
            Votre partenaire santé au quotidien
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 text-center">
            <div>
              <img src={search} alt="Chercher Médicament" className="mx-auto h-20" />
              <h3 className="font-bold text-lg mt-4">Cherchez votre médicament</h3>
              <p className="mt-2 text-sm text-gray-600">
                Le problème d'aller chercher vos médicaments dans les pharmacies s'arrête ici. 
                Toutes les pharmacies sont à portée de clic.
              </p>
            </div>
            <div>
              <img src={ordonnance} alt="E-ordonnance" className="mx-auto h-20" />
              <h3 className="font-bold text-lg mt-4">Prenez votre e-ordonnance</h3>
              <p className="mt-2 text-sm text-gray-600">
                Vous avez déjà pris un mauvais médicament à cause d’un nom commercial semblable ? 
                Les e-ordonnances sont là pour vous éviter cela.
              </p>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-16 px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Dawaii en chiffres</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <img src={uuuser} alt="Utilisateurs" className="mx-auto h-12 mb-2" />
              <p className="text-2xl font-bold">120 000+</p>
              <p className="text-sm text-gray-600">utilisateurs satisfaits</p>
            </div>
            <div>
              <img src={docteur} alt="Médecins" className="mx-auto h-12 mb-2" />
              <p className="text-2xl font-bold">3 500+</p>
              <p className="text-sm text-gray-600">médecins disponibles</p>
            </div>
            <div>
              <img src={pharma} alt="Pharmacies" className="mx-auto h-12 mb-2" />
              <p className="text-2xl font-bold">2 800+</p>
              <p className="text-sm text-gray-600">pharmacies connectées</p>
            </div>
          </div>
        </section>

        {/* Comment utiliser */}
        <section className="py-16 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">Comment utiliser ?</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
            <div>
              <img src={aduser} alt="Créer compte" className="mx-auto h-44" />
              <h3 className="font-bold text-lg mt-4">1. Créez votre compte patient</h3>
              <p className="mt-2 text-sm text-gray-600">
                Créez votre compte en quelques instants. C’est facile, rapide et sécurisé, même pour les débutants !
              </p>
            </div>
            <div>
              <img src={search} alt="Rechercher médicament" className="mx-auto h-44" />
              <h3 className="font-bold text-lg mt-4">2. Cherchez votre médicament</h3>
              <p className="mt-2 text-sm text-gray-600">
                Grâce à notre barre de recherche intelligente, trouvez rapidement n’importe quel médicament, avec ou sans e-ordonnance.
              </p>
            </div>
            <div>
              <img src={pharma} alt="Choisir pharmacie" className="mx-auto h-44" />
              <h3 className="font-bold text-lg mt-4">3. Choisissez la pharmacie convenable</h3>
              <p className="mt-2 text-sm text-gray-600">
                En un clic, toutes les pharmacies ayant votre médicament s’affichent, avec lien Google Maps pour vous guider.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
