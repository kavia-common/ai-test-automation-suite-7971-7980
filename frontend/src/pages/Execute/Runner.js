import React, { useEffect, useRef, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ExecuteAPI, TestsAPI, ReportsAPI } from '../../api/endpoints';

export default function Runner() {
  const trigger = useApi(ExecuteAPI.trigger, []);
  const status = useApi(ExecuteAPI.status, []);
  const tests = useApi(TestsAPI.list, []);
  const [selection, setSelection] = useState({ testIds: [] });
  const [currentExecution, setCurrentExecution] = useState(null);
  const [reportForExecution, setReportForExecution] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try { await tests.call(); } catch { /* error handled */ }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRun = async () => {
    const payload = { test_ids: selection.testIds };
    try {
      const res = await trigger.call(payload);
      // Expect backend to return { id, status, ... } or { execution_id }
      const execId = res?.id || res?.execution_id || res?.run_id; // support legacy
      if (execId) {
        setCurrentExecution(execId);
        setReportForExecution(null);
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
          try {
            const st = await status.call(execId);
            // When completed/failed/cancelled, stop polling and try load report by execution
            const endStates = ['completed', 'failed', 'cancelled', 'done', 'finished'];
            if (st?.status && endStates.includes(String(st.status).toLowerCase())) {
              clearInterval(pollRef.current);
              try {
                const rpt = await ReportsAPI.byExecution(execId);
                setReportForExecution(rpt);
              } catch {
                // ignore if not present
              }
            }
          } catch {
            clearInterval(pollRef.current);
          }
        }, 2000);
      }
    } catch {
      // Errors already normalized & logged. UI shows message below.
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
      {tests.error && <div className="error">Failed to load tests: {tests.friendlyMessage}</div>}
      <div className="grid two" style={{ marginTop: 8 }}>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Select Tests</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.isArray(tests.data) && tests.data.length > 0 ? (
              tests.data.map((t) => (
                <label key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={selection.testIds.includes(t.id)} onChange={() => toggle(t.id)} />
                  <span>{t.title || t.name}</span>
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
            {trigger.error && (
              <div className="error" style={{ marginTop: 8 }}>
                Failed to start execution: {trigger.friendlyMessage}
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Status</h4>
          {!currentExecution && <div className="empty">No active run.</div>}
          {currentExecution && (
            <>
              <div style={{ marginBottom: 8 }}>Execution ID: <code>{currentExecution}</code></div>
              {status.loading && <div>Polling status...</div>}
              {status.error && <div className="error">Polling failed: {status.friendlyMessage}</div>}
              {status.data && (
                <div>
                  <div>State: <span className={`badge ${status.data.status === 'completed' ? 'ok' : status.data.status === 'failed' ? 'err' : 'warn'}`}>{status.data.status}</span></div>
                  <div>Progress: {typeof status.data.progress === 'number' ? `${status.data.progress}%` : '-'}</div>
                  {status.data.summary && (
                    <pre style={{ background: '#F9FAFB', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(status.data.summary, null, 2)}
                    </pre>
                  )}
                  {reportForExecution && (
                    <div style={{ marginTop: 12 }}>
                      <div className="badge ok">Report Ready</div>
                    </div>
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
