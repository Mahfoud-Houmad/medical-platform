import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a2342] text-gray-300 text-center px-4 py-4 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <p className="font-medium">Dawaii © 2025 – Tous droits réservés</p>
          <p className="text-gray-400">Conçu  par une équipe passionnée par la technologie et la santé.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-cyan-400">
          <a href="#" className="hover:underline">À propos</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Politique de confidentialité</a>
          <a href="#" className="hover:underline">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
