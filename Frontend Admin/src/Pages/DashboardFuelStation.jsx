import React from 'react';
import { Fuel, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './DashboardFuelStation.css';

function DashboardFuelStation() {
  // Sample data for fuel stations
  const stationData = [
    { id: 1, name: 'Petro Lanka', location: 'Colombo 07', fuelAvailable: 'Diesel, Petrol', capacity: '10,000L' },
    { id: 2, name: 'Lanka IOC', location: 'Kandy', fuelAvailable: 'Petrol 92, Petrol 95', capacity: '7,500L' },
    { id: 3, name: 'Ceypetco Station', location: 'Jaffna', fuelAvailable: 'Diesel', capacity: '5,000L' },
  ];

  return (
    <div className="container">
      {/* Navigation buttons */}
      <div className="button-container">
        <Link to="/FuelDash" className="nav-button">Fuel Stations Dashboard</Link>
        <Link to="/OwnerDash" className="nav-button">Vehicle Owner Dashboard</Link>
      </div>

      <div className="dashboard-card">
        <div className="header">
          <div className="icon-container">
            <Fuel className="icon" />
          </div>
          <h2 className="title">Fuel Stations Dashboard</h2>
          <p className="subtitle">Overview of registered fuel stations</p>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Station ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Fuel Available</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {stationData.map((station, index) => (
              <tr key={index}>
                <td>{station.id}</td>
                <td>{station.name}</td>
                <td><MapPin className="icon-inline" /> {station.location}</td>
                <td>{station.fuelAvailable}</td>
                <td>{station.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardFuelStation;
