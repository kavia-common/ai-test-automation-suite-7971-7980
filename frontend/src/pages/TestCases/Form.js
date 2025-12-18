import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { TestsAPI, AIGenerateAPI } from '../../api/endpoints';

export default function TestForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const getReq = useApi(TestsAPI.get, []);
  const saveCreate = useApi(TestsAPI.create, []);
  const saveUpdate = useApi(TestsAPI.update, []);
  const aiGen = useApi(AIGenerateAPI.generate, []);

  // Harmonized backend fields: title, description, status
  const [form, setForm] = useState({ title: '', description: '', status: 'draft' });
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getReq.call(id);
          if (data) {
            setForm({
              title: data.title || data.name || '',
              description: data.description || '',
              status: data.status || 'draft',
            });
          }
        } catch {
          /* friendly message shown below */
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
    };
    try {
      if (isEdit) {
        await saveUpdate.call(id, payload);
      } else {
        await saveCreate.call(payload);
      }
      navigate('/tests');
    } catch {
      // Friendly message shown below
    }
  };

  const onGenerate = async () => {
    try {
      const res = await aiGen.call(prompt);
      // Adapt to response mapping for /api/ai/generate-tests
      // Expecting shape like { tests: [{ title, description, status }] } or { suggestions: [...] }
      const candidates = Array.isArray(res?.tests) ? res.tests : (Array.isArray(res?.suggestions) ? res.suggestions : []);
      if (candidates.length > 0) {
        const t = candidates[0];
        setForm({
          title: t.title || t.name || 'AI Generated Test',
          description: t.description || '',
          status: t.status || 'proposed',
        });
      }
    } catch {
      // Friendly message shown below
    }
  };

  return (
    <div className="panel">
      <div className="toolbar">
        <Link to="/tests" className="btn">Back</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => navigate('/execute')}>Execute</button>
          <button className="btn primary" onClick={onSubmit} disabled={saveCreate.loading || saveUpdate.loading}>
            {isEdit ? 'Save Changes' : 'Create Test'}
          </button>
        </div>
      </div>

      {(getReq.loading || saveCreate.loading || saveUpdate.loading) && <div>Loading...</div>}
      {(getReq.error || saveCreate.error || saveUpdate.error) && (
        <div className="error">
          {getReq.error && <div>Load failed: {getReq.friendlyMessage}</div>}
          {saveCreate.error && <div>Create failed: {saveCreate.friendlyMessage}</div>}
          {saveUpdate.error && <div>Update failed: {saveUpdate.friendlyMessage}</div>}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid two" style={{ gap: 16 }}>
        <div>
          <label>Title</label>
          <input className="input" name="title" value={form.title} onChange={onChange} required />
        </div>
        <div>
          <label>Status</label>
          <select className="select" name="status" value={form.status} onChange={onChange}>
            <option value="draft">Draft</option>
            <option value="proposed">Proposed</option>
            <option value="approved">Approved</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>
        <div className="grid" style={{ gridColumn: '1 / -1' }}>
          <label>Description</label>
          <textarea className="textarea" name="description" value={form.description} onChange={onChange} />
        </div>
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <h4 style={{ marginTop: 0 }}>AI Generate</h4>
        <p className="muted">Generate a draft test using AI and then save.</p>
        <div className="grid">
          <textarea
            className="textarea"
            placeholder="Describe the feature, user flow, acceptance criteria..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div>
            <button className="btn secondary" onClick={onGenerate} disabled={aiGen.loading || !prompt.trim()}>
              {aiGen.loading ? 'Generating...' : 'Generate Test'}
            </button>
          </div>
        </div>
        {aiGen.error && <div className="error" style={{ marginTop: 8 }}>AI generation failed: {aiGen.friendlyMessage}</div>}
      </div>
    </div>
  );
}
