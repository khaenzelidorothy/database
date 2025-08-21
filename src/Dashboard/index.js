import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useDashboardData } from "./hooks/useDashboardData";
import "./style.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const {
    loading,
    error,
    borrowers,
    disbursed,
    repayment,
    outstanding,
    generalBarData,
    creditScorePieData,
  } = useDashboardData();

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <p>Total Borrowers</p>
          <b>{borrowers}</b>
        </div>
        <div className="card">
          <p>Disbursed Amount</p>
          <b>RWF {disbursed.toLocaleString()}</b>
        </div>
        <div className="card">
          <p>Repayment</p>
          <b>RWF {repayment.toLocaleString()}</b>
        </div>
        <div className="card">
          <p>Outstanding Amount</p>
          <b>RWF {outstanding.toLocaleString()}</b>
        </div>
      </div>

      <div className="charts-container">
        <div className="bar-chart">
          <h3>Summary: Disbursed, Repayment & Outstanding</h3>
          {generalBarData?.labels?.length > 0 && generalBarData?.datasets?.length > 0 ? (
            <Bar
              data={generalBarData}
              options={{
                responsive: true,
                scales: {
                  x: { type: "category" },
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (value) => value.toLocaleString() },
                  },
                },
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
              }}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        <div className="pie-chart">
          <h3>Credit Score at Application Frequency</h3>
          {creditScorePieData?.labels?.length > 0 && creditScorePieData?.datasets?.length > 0 ? (
            <Pie
              data={creditScorePieData}
              options={{
                responsive: true,
                plugins: { legend: { position: "right" }, tooltip: { enabled: true } },
              }}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;