import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/Pages/Login';
import ForgotPassword from '../src/Pages/ForgotPassword';
import DashboardFuelStation from './Pages/DashboardFuelStation';
import Dashboard from './Pages/OwnerDash';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/FuelDash" element={<DashboardFuelStation />} />
        <Route path="/OwnerDash" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
