import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/pages/fuelstationDashboard.css"; // Make sure this CSS file exists
import Dashboard from "./assets/pages/fuelstationDashboard"; // Dashboard component
import ForgotPassword from "./assets/pages/Forgotpassword"; // ForgotPassword component
import Register from "./assets/pages/Register"; // Register component
import StationLogin from "./assets/pages/stationlogin"; // StationLogin component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<StationLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
