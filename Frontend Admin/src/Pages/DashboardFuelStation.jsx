import React, { useState, useEffect } from 'react';
import { Fuel, MapPin, User, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardFuelStation.css';

function DashboardFuelStation() {
  // State for managing dropdown visibility and fuel stations data
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [stationData, setStationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  
  // Form state for adding/editing stations
  const [formData, setFormData] = useState({
    station_name: '',
    location: '',
    owner_id: ''
  });

  // Toggle the dropdown visibility
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Fetch fuel stations data
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      // Use the full URL for development
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin_fuel_stations`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched data:", data); // Debug log
      setStationData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err); // Debug log
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission for adding a new station
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin_fuel_stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add station');
      }

      // Reset form and refresh stations
      setFormData({ station_name: '', location: '', owner_id: '' });
      setShowAddForm(false);
      fetchStations();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form submission for editing a station
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin_fuel_stations/${currentStation.station_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update station');
      }

      // Reset form and refresh stations
      setFormData({ station_name: '', location: '', owner_id: '' });
      setShowEditForm(false);
      setCurrentStation(null);
      fetchStations();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle station deletion
  const handleDelete = async (stationId) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        const API_URL = 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/admin_fuel_stations/${stationId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete station');
        }

        fetchStations();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Open edit form with station data
  const handleEdit = (station) => {
    setCurrentStation(station);
    setFormData({
      station_name: station.station_name,
      location: station.location,
      owner_id: station.owner_id || ''
    });
    setShowEditForm(true);
  };

  // Debug log to see what's in stationData
  console.log("Current stationData:", stationData);
  console.log("stationData length:", stationData.length);
  console.log("stationData type:", typeof stationData);

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
        <Link to="/FuelDash" className="nav-button active">Fuel Stations Dashboard</Link>
        <Link to="/OwnerDash" className="nav-button">Vehicle Owner Dashboard</Link>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-card">
        <div className="header">
          <div className="icon-container">
            <Fuel className="icon" />
          </div>
          <h2 className="title">Fuel Stations Dashboard</h2>
          <p className="subtitle">Overview of registered fuel stations</p>
          <button 
            className="add-button" 
            onClick={() => {
              setShowAddForm(true);
              setShowEditForm(false);
            }}
          >
            <Plus size={16} /> Add Station
          </button>
        </div>

        {/* Add Station Form */}
        {showAddForm && (
          <div className="form-container">
            <h3>Add New Fuel Station</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Station Name</label>
                <input
                  type="text"
                  name="station_name"
                  value={formData.station_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Owner ID</label>
                <input
                  type="number"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Station</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Station Form */}
        {showEditForm && currentStation && (
          <div className="form-container">
            <h3>Edit Fuel Station</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Station Name</label>
                <input
                  type="text"
                  name="station_name"
                  value={formData.station_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Owner ID</label>
                <input
                  type="number"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Update Station</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowEditForm(false);
                    setCurrentStation(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading stations data...</div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Station ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Owner ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stationData) && stationData.length > 0 ? (
                stationData.map((station) => (
                  <tr key={station.station_id}>
                    <td>{station.station_id}</td>
                    <td>{station.station_name}</td>
                    <td><MapPin className="icon-inline" /> {station.location}</td>
                    <td>{station.owner_id || 'N/A'}</td>
                    <td className="actions">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEdit(station)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(station.station_id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No fuel stations found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardFuelStation;
