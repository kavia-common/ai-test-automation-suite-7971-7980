import React, { useEffect, useState } from 'react';
import { healthCheck, getBackendDocsUrl } from '../../api/client';

/** Top header with backend health indicator and docs link */
export default function Header() {
  const [status, setStatus] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;
    async function ping() {
      setStatus((s) => ({ ...s, loading: true }));
      const res = await healthCheck();
      if (!mounted) return;
      setStatus({ loading: false, ok: !!res.ok });
    }
    ping();
    const id = setInterval(ping, 20000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const docsUrl = getBackendDocsUrl();

  return (
    <header className="header">
      <div className="left">
        <h2 className="title">AI-Enabled Testing Framework</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <a
          href={docsUrl}
          target="_blank"
          rel="noreferrer"
          className="btn"
          title="Open Backend API Docs"
          aria-label="Open Backend API Docs"
        >
          API Docs
        </a>
        <span className={`health ${status.ok ? 'ok' : 'bad'}`} aria-live="polite">
          <span className="dot" />
          {status.loading ? 'Checking...' : status.ok ? 'Backend: Healthy' : 'Backend: Unreachable'}
        </span>
      </div>
    </header>
  );
}
