import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo + Titre */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="Lo000go" className="h-8" />
        <span className="text-2xl font-bold text-cyan-600 hover:text-cyan-700 transition duration-300">
          DAWAII
        </span>
      </div>

      {/* Liens de navigation */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link
          to={`/${localStorage.getItem('role') || ''}`}
          className="text-gray-700 hover:text-cyan-600 transition duration-300"
        >
          Accueil
        </Link>
        <Link
          to="/profil"
          className="text-gray-700 hover:text-cyan-600 transition duration-300"
        >
          Profil
        </Link>
        <button
          onClick={handleLogout}
          className="bg-cyan-600 hover:bg-cyan-700 text-white py-1.5 px-4 rounded-md transition duration-300"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
