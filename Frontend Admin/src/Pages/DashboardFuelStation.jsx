import React, { useState, useEffect } from 'react';
import { Fuel, MapPin, User, Edit, Trash2, Plus, Search, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardFuelStation.css';

function DashboardFuelStation() {
  // Navigation hook for redirecting
  const navigate = useNavigate();
  
  // State for managing dropdown visibility and fuel stations data
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [stationData, setStationData] = useState([]);
  const [filteredStationData, setFilteredStationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [showSearchColumnDropdown, setShowSearchColumnDropdown] = useState(false);
  
  // Form state for adding/editing stations
  const [formData, setFormData] = useState({
    station_name: '',
    location: '',
    owner_id: ''
  });

  // Toggle the dropdown visibility
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  
  // Toggle search column dropdown
  const toggleSearchColumnDropdown = () => setShowSearchColumnDropdown(!showSearchColumnDropdown);

  // Handle logout
  const handleLogout = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to the login page at root path
    navigate('/');
  };

  // Fetch fuel stations data
  useEffect(() => {
    fetchStations();
  }, []);

  // Filter stations when search term or search column changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStationData(stationData);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = stationData.filter(station => {
        if (searchColumn === 'all') {
          return (
            station.station_id.toString().includes(lowercasedSearch) ||
            station.station_name.toLowerCase().includes(lowercasedSearch) ||
            station.location.toLowerCase().includes(lowercasedSearch) ||
            (station.owner_id && station.owner_id.toString().includes(lowercasedSearch))
          );
        } else {
          const fieldValue = station[searchColumn];
          return fieldValue !== null && 
                 fieldValue !== undefined && 
                 String(fieldValue).toLowerCase().includes(lowercasedSearch);
        }
      });
      setFilteredStationData(filtered);
    }
  }, [searchTerm, searchColumn, stationData]);

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
      setFilteredStationData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err); // Debug log
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search column selection
  const handleSearchColumnSelect = (column) => {
    setSearchColumn(column);
    setShowSearchColumnDropdown(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchColumn('all');
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

  // Get display name for search column
  const getColumnDisplayName = (column) => {
    switch (column) {
      case 'station_id': return 'Station ID';
      case 'station_name': return 'Station Name';
      case 'location': return 'Location';
      case 'owner_id': return 'Owner ID';
      case 'all': return 'All Columns';
      default: return column;
    }
  };

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
            <button onClick={handleLogout} className="dropdown-item logout-button">Logout</button>
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

        {/* Search Bar with Column Selection */}
        <div className="table-search-container">
          <div className="search-bar">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search-button" onClick={clearSearch}>
                  ×
                </button>
              )}
            </div>
            <div className="search-column-selector">
              <button 
                className="column-selector-button" 
                onClick={toggleSearchColumnDropdown}
              >
                {getColumnDisplayName(searchColumn)} <ChevronDown size={16} />
              </button>
              {showSearchColumnDropdown && (
                <div className="column-dropdown">
                  <div 
                    className={`column-option ${searchColumn === 'all' ? 'selected' : ''}`}
                    onClick={() => handleSearchColumnSelect('all')}
                  >
                    All Columns
                  </div>
                  <div 
                    className={`column-option ${searchColumn === 'station_id' ? 'selected' : ''}`}
                    onClick={() => handleSearchColumnSelect('station_id')}
                  >
                    Station ID
                  </div>
                  <div 
                    className={`column-option ${searchColumn === 'station_name' ? 'selected' : ''}`}
                    onClick={() => handleSearchColumnSelect('station_name')}
                  >
                    Station Name
                  </div>
                  <div 
                    className={`column-option ${searchColumn === 'location' ? 'selected' : ''}`}
                    onClick={() => handleSearchColumnSelect('location')}
                  >
                    Location
                  </div>
                  <div 
                    className={`column-option ${searchColumn === 'owner_id' ? 'selected' : ''}`}
                    onClick={() => handleSearchColumnSelect('owner_id')}
                  >
                    Owner ID
                  </div>
                </div>
              )}
            </div>
          </div>
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
              {Array.isArray(filteredStationData) && filteredStationData.length > 0 ? (
                filteredStationData.map((station) => (
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
                  <td colSpan="5" className="no-data">
                    {searchTerm ? 'No matching stations found' : 'No fuel stations found'}
                  </td>
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
