import React from "react";
import "./App.css";
import "./assets/pages/fuelstationDashboard.css"; // Make sure this CSS file exists
import Dashboard from "./assets/pages/fuelstationDashboard"; // Make sure Dashboard.jsx is in the same folder

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
