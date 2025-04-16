import React from 'react';


const Dashboard = () => {
  // Sample data for vehicle owners
  const vehicleData = [
    { vehicle_id: 1, registration_number: 'ABC123', chassis: 'XYZ456', owner_id: 1, fuel_quota: 50.00, category_id: 1 },
    { vehicle_id: 2, registration_number: 'DEF456', chassis: 'XYZ789', owner_id: 2, fuel_quota: 45.00, category_id: 2 },
    { vehicle_id: 3, registration_number: 'GHI789', chassis: 'XYZ012', owner_id: 3, fuel_quota: 60.00, category_id: 3 },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Vehicle Owners Dashboard</h1>
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Registration Number</th>
            <th>Chassis</th>
            <th>Owner ID</th>
            <th>Fuel Quota</th>
            <th>Category ID</th>
          </tr>
        </thead>
        <tbody>
          {vehicleData.map((vehicle, index) => (
            <tr key={index}>
              <td>{vehicle.vehicle_id}</td>
              <td>{vehicle.registration_number}</td>
              <td>{vehicle.chassis}</td>
              <td>{vehicle.owner_id}</td>
              <td>{vehicle.fuel_quota}</td>
              <td>{vehicle.category_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
