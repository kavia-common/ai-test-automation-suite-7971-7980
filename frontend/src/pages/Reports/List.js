import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { ReportsAPI } from '../../api/endpoints';

export default function ReportsList() {
  const list = useApi(ReportsAPI.list, []);
  useEffect(() => {
    const load = async () => { try { await list.call(); } catch {} };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatus = (r) => r.status || r.result || 'unknown';
  const badgeClass = (val) => (val === 'passed' || val === 'completed') ? 'ok' : (val === 'failed' ? 'err' : 'warn');

  return (
    <div className="panel">
      <div className="toolbar">
        <h3 style={{ margin: 0 }}>Reports</h3>
      </div>
      {list.loading && <div>Loading reports...</div>}
      {list.error && <div className="error">Failed to load reports: {list.friendlyMessage}</div>}
      {!list.loading && (!Array.isArray(list.data) || list.data.length === 0) && (
        <div className="empty">No reports generated yet.</div>
      )}
      {Array.isArray(list.data) && list.data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.data.map((r) => {
              const status = getStatus(r);
              return (
                <tr key={r.id}>
                  <td>{r.title || r.name || `Report ${r.id}`}</td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                  <td>
                    <span className={`badge ${badgeClass(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td><Link className="btn" to={`/reports/${r.id}`}>Details</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
