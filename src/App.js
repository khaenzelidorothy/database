import React from 'react';
import './styles.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../src/shared-components/Sidebar/Sidebar/index.js';
import Dashboard from './Dashboard/index.js';
import Members from './Members/index.js';
import Banks from './Banks/index.js';
import './App.css';
import MembersDetails from './Members/index.js';
import Signin from './Signin';
import Teaser from './Teaser';
import Pending from './Loans/Components/Pending';
import Approved from './Loans/Components/Approved';
import Denied from './Loans/Components/Denied';

function AppLayout() {
  const location = useLocation();
  const hideSidebar = 
    location.pathname === '/' ||
    location.pathname === '/signin' ||
    location.pathname === '/logout';

  return (
    <div className="app-container">
      {!hideSidebar && (
        <div className="Sidebar">
          <Sidebar />
        </div>
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Teaser />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loans" element={<Pending />} />
          <Route path="/banks" element={<Banks />} />
          <Route path="/logout" element={<Signin />} />
          <Route path="/membersDetails" element={<MembersDetails />} />
          <Route path="/members" element={<Members />} />
          <Route path="/approved" element={<Approved />} />
          <Route path="/denied" element={<Denied />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;