import React from "react";
import "./fuelstationDashboard.css";

const Dashboard = () => {
  // Example transaction data
  const transactions = [
    {
      transaction_id: 1,
      vehicle_id: 101,
      station_id: 1,
      fuel_amount: 45.25,
      transaction_date: "2025-04-06 10:30:00",
    },
    {
      transaction_id: 2,
      vehicle_id: 102,
      station_id: 1,
      fuel_amount: 38.5,
      transaction_date: "2025-04-05 16:45:00",
    },
    {
      transaction_id: 3,
      vehicle_id: 103,
      station_id: 2,
      fuel_amount: 50.0,
      transaction_date: "2025-04-04 09:15:00",
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Fuel Station Dashboard</h1>
      </header>

      <section className="dashboard-content">
        <h2>Vehicle Fuel Transactions</h2>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Vehicle ID</th>
              <th>Station ID</th>
              <th>Fuel Amount (L)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transaction_id}>
                <td>{tx.transaction_id}</td>
                <td>{tx.vehicle_id}</td>
                <td>{tx.station_id}</td>
                <td>{tx.fuel_amount}</td>
                <td>{tx.transaction_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
