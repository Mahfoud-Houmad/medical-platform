import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PatientPage from './pages/PatientPage';
import MedecinPage from './pages/MedecinPage';
import PharmaciePage from './pages/PharmaciePage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        
        {/* Routes protégées */}
        <Route path="/patient" element={
          <PrivateRoute>
            <PatientPage />
          </PrivateRoute>
        } />
        
        <Route path="/medecin" element={
          <PrivateRoute>
            <MedecinPage />
          </PrivateRoute>
        } />
        
        <Route path="/pharmacie" element={
          <PrivateRoute>
            <PharmaciePage />
          </PrivateRoute>
        } />

        <Route path="/profil" element={
          <PrivateRoute>
           <ProfilePage />
         </PrivateRoute>
        } /> 

      </Routes>
    </Router>
  );
}

export default App;
