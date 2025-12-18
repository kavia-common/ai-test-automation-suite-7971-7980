import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { ReportsAPI, TestsAPI } from '../api/endpoints';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const tests = useApi(TestsAPI.list, []);
  const reports = useApi(ReportsAPI.list, []);

  useEffect(() => {
    const load = async () => {
      try { await tests.call(); } catch (e) { /* already logged */ }
      try { await reports.call(); } catch (e) { /* already logged */ }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init

  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Dashboard</h3>
      {(tests.loading || reports.loading) && <div>Loading...</div>}
      {(tests.error || reports.error) && (
        <div className="error">
          <div>Failed to load summary. The app will continue with partial data.</div>
          {tests.error && <div>Tests: {tests.friendlyMessage}</div>}
          {reports.error && <div>Reports: {reports.friendlyMessage}</div>}
        </div>
      )}
      {!tests.loading && !reports.loading && (
        <div className="grid three">
          <div className="card">
            <div className="muted">Total Tests</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {Array.isArray(tests.data) ? tests.data.length : 0}
            </div>
            <Link to="/tests" className="btn" style={{ marginTop: 8 }}>Manage</Link>
          </div>
          <div className="card">
            <div className="muted">Reports</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {Array.isArray(reports.data) ? reports.data.length : 0}
            </div>
            <Link to="/reports" className="btn" style={{ marginTop: 8 }}>View</Link>
          </div>
          <div className="card">
            <div className="muted">Quick Actions</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <Link to="/tests/new" className="btn primary">New Test</Link>
              <Link to="/execute" className="btn secondary">Run Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
