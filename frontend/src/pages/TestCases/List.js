import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { TestsAPI } from '../../api/endpoints';

export default function TestList() {
  const list = useApi(TestsAPI.list, []);
  const remove = useApi(TestsAPI.remove, []);
  const navigate = useNavigate();

  useEffect(() => { list.call(); }, []); // load

  const onDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    await remove.call(id);
    await list.call();
  };

  return (
    <div className="panel">
      <div className="toolbar">
        <button className="btn primary" onClick={() => navigate('/tests/new')}>New Test</button>
      </div>
      {list.loading && <div>Loading tests...</div>}
      {list.error && <div className="error">Failed to load tests. Check backend availability and CORS.</div>}
      {!list.loading && (!Array.isArray(list.data) || list.data.length === 0) && (
        <div className="empty">No tests found. Create one to get started.</div>
      )}
      {Array.isArray(list.data) && list.data.length > 0 && (
        <table className="table" aria-label="Test cases table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.data.map((t) => (
              <tr key={t.id}>
                <td>{t.title || t.name}</td>
                <td><span className="badge">{t.status || 'N/A'}</span></td>
                <td>{t.updated_at ? new Date(t.updated_at).toLocaleString() : '-'}</td>
                <td>
                  <Link to={`/tests/${t.id}`} className="btn">Edit</Link>{' '}
                  <button className="btn" onClick={() => onDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
