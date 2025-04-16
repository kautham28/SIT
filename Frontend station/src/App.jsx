import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./pages/fuelstationDashboard.css"; // Make sure this CSS file exists
import Dashboard from "./pages/fuelstationDashboard"; // Dashboard component
import ForgotPassword from "./pages/Forgotpassword"; // ForgotPassword component
import Register from "./pages/Register"; // Register component
import StationLogin from "./pages/stationlogin"; // StationLogin component
import VerifyAccount from "./pages/Verify";   
import NewPassword from "./pages/New";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<StationLogin />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/new-password" element={<NewPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
