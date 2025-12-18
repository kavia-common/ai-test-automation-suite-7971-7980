import React, { useEffect, useRef, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ExecuteAPI, TestsAPI } from '../../api/endpoints';

export default function Runner() {
  const trigger = useApi(ExecuteAPI.trigger, []);
  const status = useApi(ExecuteAPI.status, []);
  const tests = useApi(TestsAPI.list, []);
  const [selection, setSelection] = useState({ testIds: [] });
  const [currentRun, setCurrentRun] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => { tests.call(); }, []);

  const startRun = async () => {
    const payload = { test_ids: selection.testIds };
    const res = await trigger.call(payload);
    if (res?.run_id) {
      setCurrentRun(res.run_id);
      // Start polling
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        try {
          const st = await status.call(res.run_id);
          if (st?.status && ['completed', 'failed', 'cancelled'].includes(st.status)) {
            clearInterval(pollRef.current);
          }
        } catch {
          clearInterval(pollRef.current);
        }
      }, 2000);
    }
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const toggle = (id) => {
    setSelection((s) => {
      const set = new Set(s.testIds);
      set.has(id) ? set.delete(id) : set.add(id);
      return { testIds: Array.from(set) };
    });
  };

  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Execute Tests</h3>
      {tests.loading && <div>Loading tests...</div>}
      {tests.error && <div className="error">Failed to load tests.</div>}
      <div className="grid two" style={{ marginTop: 8 }}>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Select Tests</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.isArray(tests.data) && tests.data.length > 0 ? (
              tests.data.map((t) => (
                <label key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={selection.testIds.includes(t.id)} onChange={() => toggle(t.id)} />
                  <span>{t.name}</span>
                </label>
              ))
            ) : (
              <div className="empty">No tests available.</div>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={startRun} disabled={trigger.loading || selection.testIds.length === 0}>
              {trigger.loading ? 'Starting...' : 'Start Execution'}
            </button>
          </div>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Status</h4>
          {!currentRun && <div className="empty">No active run.</div>}
          {currentRun && (
            <>
              <div style={{ marginBottom: 8 }}>Run ID: <code>{currentRun}</code></div>
              {status.loading && <div>Polling status...</div>}
              {status.error && <div className="error">Polling failed. Please verify the backend run status endpoint.</div>}
              {status.data && (
                <div>
                  <div>State: <span className={`badge ${status.data.status === 'completed' ? 'ok' : status.data.status === 'failed' ? 'err' : 'warn'}`}>{status.data.status}</span></div>
                  <div>Progress: {typeof status.data.progress === 'number' ? `${status.data.progress}%` : '-'}</div>
                  {status.data.summary && (
                    <pre style={{ background: '#F9FAFB', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(status.data.summary, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
