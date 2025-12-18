import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import TestList from './pages/TestCases/List';
import TestForm from './pages/TestCases/Form';
import Runner from './pages/Execute/Runner';
import ReportsList from './pages/Reports/List';
import ReportDetails from './pages/Reports/Details';

// PUBLIC_INTERFACE
function App() {
  /** Main application rendering sidebar layout and routes. */
  return (
    <div className="app-root">
      <Router>
        <div className="layout">
          <Sidebar />
          <div className="content">
            <Header />
            <main className="main">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tests" element={<TestList />} />
                <Route path="/tests/new" element={<TestForm />} />
                <Route path="/tests/:id" element={<TestForm />} />
                <Route path="/execute" element={<Runner />} />
                <Route path="/reports" element={<ReportsList />} />
                <Route path="/reports/:id" element={<ReportDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
