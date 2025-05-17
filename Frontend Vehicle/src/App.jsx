import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Registration from './pages/Registration/Registration';
import Login from './pages/Login/Login';
import QRpage from './pages/QRpage/QRpage';
import Navbar from './Components/Navbar';
import RegistrationSuccess from './pages/Registration/RegistrationSuccess';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/qr' element={<QRpage />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;