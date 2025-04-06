import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration/Registration';
import RegistrationVehicle from './pages/RegistrationVehicle/RegistrationVehicle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/registration-vehicle" element={<RegistrationVehicle />} />
      </Routes>
    </Router>
  );
}

export default App;