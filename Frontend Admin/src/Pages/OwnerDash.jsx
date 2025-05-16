import React, { useEffect, useState } from 'react';
import { User, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardFuelStation.css'; // Reuse same CSS

const API_URL = 'http://localhost:5000/api/vehicles';

const OwnerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ reg: '', owner: '' });
  const [formData, setFormData] = useState({
    vehicle_id: null,
    registration_number: '',
    chassis: '',
    owner_id: '',
    fuel_quota: '',
    category_id: '',
  });
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        setError('Failed to fetch vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (vehicle) => {
    setFormData({ ...vehicle });
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.message || 'Deleted');
      setVehicles((prev) => prev.filter((v) => v.vehicle_id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEdit = formData.vehicle_id !== null;

    try {
      const res = await fetch(
        isEdit ? `${API_URL}/${formData.vehicle_id}` : API_URL,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Success');
        setFormData({
          vehicle_id: null,
          registration_number: '',
          chassis: '',
          owner_id: '',
          fuel_quota: '',
          category_id: '',
        });
        setIsFormVisible(false);
        setVehicles((prev) =>
          isEdit
            ? prev.map((v) => (v.vehicle_id === formData.vehicle_id ? data : v))
            : [...prev, data]
        );
      } else {
        alert(data.error || 'Failed');
      }
    } catch {
      alert('Error submitting form');
    }
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.registration_number.toLowerCase().includes(filter.reg.toLowerCase()) &&
    String(v.owner_id).includes(filter.owner)
  );

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
            <Car className="icon" />
          </div>
          <h2 className="title">Vehicle Owners Dashboard</h2>
          <p className="subtitle">Overview of registered vehicles</p>
        </div>

        <div className="filters-section">
          <input
            name="reg"
            placeholder="Filter by Registration"
            value={filter.reg}
            onChange={handleFilterChange}
          />
          <input
            name="owner"
            placeholder="Filter by Owner ID"
            value={filter.owner}
            onChange={handleFilterChange}
          />
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reg. Number</th>
              <th>Chassis</th>
              <th>Owner ID</th>
              <th>Fuel Quota</th>
              <th>Category ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="7" className="error-message">{error}</td></tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr key={v.vehicle_id}>
                  <td>{v.vehicle_id}</td>
                  <td>{v.registration_number}</td>
                  <td>{v.chassis}</td>
                  <td>{v.owner_id}</td>
                  <td>{v.fuel_quota}</td>
                  <td>{v.category_id}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(v)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(v.vehicle_id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="add-section">
          <button className="add-button" onClick={() => setIsFormVisible(true)}>Add New Vehicle</button>
        </div>
      </div>

      {/* Popup Form */}
      {isFormVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>{formData.vehicle_id ? 'Update Vehicle' : 'Add New Vehicle'}</h3>
            <form className="vehicle-form" onSubmit={handleFormSubmit}>
              <input
                name="registration_number"
                placeholder="Registration Number"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                required
              />
              <input
                name="chassis"
                placeholder="Chassis"
                value={formData.chassis}
                onChange={(e) => setFormData({ ...formData, chassis: e.target.value })}
                required
              />
              <input
                name="owner_id"
                placeholder="Owner ID"
                value={formData.owner_id}
                onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                required
              />
              <input
                name="fuel_quota"
                placeholder="Fuel Quota"
                type="number"
                value={formData.fuel_quota}
                onChange={(e) => setFormData({ ...formData, fuel_quota: e.target.value })}
                required
              />
              <input
                name="category_id"
                placeholder="Category ID"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              />
              <button type="submit">{formData.vehicle_id ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setIsFormVisible(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
