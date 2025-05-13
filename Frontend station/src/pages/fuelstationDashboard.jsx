import React, { useEffect, useState } from "react";
import "./fuelstationDashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    // Fetch transactions from the backend
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/vehicle_fuel_transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Corrected string interpolation
            },
          }
        );
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          // Optionally redirect to login
          // window.location.href = "/login";
        } else if (err.response?.status === 403) {
          setError("Access denied. Fuel station owner role required.");
        } else {
          setError("Failed to fetch transactions: " + err.message);
        }
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Fuel Station Dashboard</h1>
      </header>

      <section className="dashboard-content">
        <h2>Vehicle Fuel Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions found for this station.</p>
        ) : (
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
        )}
      </section>
    </div>
  );
};

export default Dashboard;