import React, { useState } from 'react';
import { Fuel, MapPin, User } from 'lucide-react'; // Import the User icon
import { Link } from 'react-router-dom'; // Import Link for navigation
import './DashboardFuelStation.css';

function DashboardFuelStation() {
  // State for managing dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Sample data for fuel stations
  const stationData = [
    { id: 1, name: 'Petro Lanka', location: 'Colombo 07', fuelAvailable: 'Diesel, Petrol', capacity: '10,000L' },
    { id: 2, name: 'Lanka IOC', location: 'Kandy', fuelAvailable: 'Petrol 92, Petrol 95', capacity: '7,500L' },
    { id: 3, name: 'Ceypetco Station', location: 'Jaffna', fuelAvailable: 'Diesel', capacity: '5,000L' },
  ];

  // Toggle the dropdown visibility
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <div className="container">
      {/* Profile Icon and Dropdown */}
      <div className="profile-container">
        <div className="profile-icon" onClick={toggleDropdown}>
          <User className="icon" />
        </div>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <Link to="/logout" className="dropdown-item">Logout</Link>

          </div>
        )}
      </div>

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
