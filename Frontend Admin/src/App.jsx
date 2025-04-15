import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/Pages/Login';
import ForgotPassword from '../src/Pages/ForgotPassword';

import VerifyCode from './Pages/VerifyCode';
import DashboardFuelStation from './Pages/DashboardFuelStation';
import Dashboard from './Pages/OwnerDash';

import VerifyCode from './Pages/VerifyCode';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/FuelDash" element={<DashboardFuelStation />} />
        <Route path="/OwnerDash" element={<Dashboard />} />

        <Route path="/verify-code" element={<VerifyCode />} />

      </Routes>
    </Router>
  );
}

export default App;
