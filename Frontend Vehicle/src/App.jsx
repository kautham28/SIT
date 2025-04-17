import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Registration from './pages/Registration/Registration';
import RegistrationVehicle from './pages/RegistrationVehicle/RegistrationVehicle';
import Login from './pages/Login/Login';
import QRpage from './pages/QRpage/QRpage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/registration-vehicle" element={<RegistrationVehicle />} />
        <Route path="/login" element={<Login />} />
        <Route path='/qr' element={<QRpage />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;