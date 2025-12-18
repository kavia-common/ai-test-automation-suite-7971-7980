import React, { useEffect, useState } from 'react';
import { healthCheck } from '../../api/client';

/** Top header with backend health indicator */
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

  return (
    <header className="header">
      <div className="left">
        <h2 className="title">AI-Enabled Testing Framework</h2>
      </div>
      <div>
        <span className={`health ${status.ok ? 'ok' : 'bad'}`} aria-live="polite">
          <span className="dot" />
          {status.loading ? 'Checking...' : status.ok ? 'Backend: Healthy' : 'Backend: Unreachable'}
        </span>
      </div>
    </header>
  );
}
