import React from 'react';
import { NavLink } from 'react-router-dom';

/** Sidebar navigation using Corporate Navy theme */
export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      <div className="brand">
        <h1 className="title">AI Test Suite</h1>
        <p className="subtitle">Corporate Navy</p>
      </div>
      <nav className="nav">
        <NavLink to="/" end>
          <span>🏠</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tests">
          <span>🧪</span>
          <span>Test Cases</span>
        </NavLink>
        <NavLink to="/execute">
          <span>▶️</span>
          <span>Execute</span>
        </NavLink>
        <NavLink to="/reports">
          <span>📊</span>
          <span>Reports</span>
        </NavLink>
      </nav>
      <div style={{ marginTop: 'auto', padding: 12, color: 'var(--muted)', fontSize: 12 }}>
        © {new Date().getFullYear()} Kavia
      </div>
    </aside>
  );
}
