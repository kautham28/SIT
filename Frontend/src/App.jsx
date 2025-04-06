import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration/Registration';
import RegistrationVehicle from './pages/RegistrationVehicle/RegistrationVehicle';
import Login from './pages/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/registration-vehicle" element={<RegistrationVehicle />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;