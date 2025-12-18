import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { ReportsAPI } from '../../api/endpoints';

export default function ReportDetails() {
  const { id } = useParams();
  const req = useApi(ReportsAPI.get, []);
  useEffect(() => { req.call(id); }, [id]); // load

  return (
    <div className="panel">
      <div className="toolbar">
        <Link to="/reports" className="btn">Back</Link>
      </div>
      {req.loading && <div>Loading...</div>}
      {req.error && <div className="error">Failed to load report. Verify backend and report ID.</div>}
      {req.data && (
        <>
          <h3 style={{ marginTop: 0 }}>{req.data.title || req.data.name || `Report ${id}`}</h3>
          <div className="grid two" style={{ marginBottom: 12 }}>
            <div className="card">
              <div><strong>Date:</strong> {req.data.created_at ? new Date(req.data.created_at).toLocaleString() : '-'}</div>
              <div><strong>Result:</strong> <span className={`badge ${req.data.status === 'passed' || req.data.result === 'passed' ? 'ok' : (req.data.status === 'failed' || req.data.result === 'failed') ? 'err' : 'warn'}`}>{req.data.status || req.data.result || 'unknown'}</span></div>
            </div>
            <div className="card">
              <div><strong>Duration:</strong> {req.data.duration || '-'}</div>
              <div><strong>Environment:</strong> {req.data.env || '-'}</div>
            </div>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Summary</h4>
            <pre style={{ background: '#F9FAFB', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(req.data.summary || req.data, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
