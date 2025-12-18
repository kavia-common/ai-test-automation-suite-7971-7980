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

  const [form, setForm] = useState({ name: '', type: 'functional', steps: '', metadata: '' });
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (isEdit) {
      getReq.call(id).then((data) => {
        if (data) {
          setForm({
            name: data.name || '',
            type: data.type || 'functional',
            steps: (Array.isArray(data.steps) ? data.steps.join('\n') : data.steps) || '',
            metadata: typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata || {}, null, 2),
          });
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      type: form.type,
      steps: form.steps.split('\n').filter(Boolean),
      metadata: tryParseJSON(form.metadata),
    };
    if (isEdit) {
      await saveUpdate.call(id, payload);
    } else {
      await saveCreate.call(payload);
    }
    navigate('/tests');
  };

  const onGenerate = async () => {
    const res = await aiGen.call(prompt);
    if (res && Array.isArray(res.tests) && res.tests.length > 0) {
      const t = res.tests[0];
      setForm({
        name: t.name || 'AI Generated Test',
        type: t.type || 'functional',
        steps: (Array.isArray(t.steps) ? t.steps.join('\n') : (t.steps || '')),
        metadata: JSON.stringify(t.metadata || {}, null, 2),
      });
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
      {(getReq.error || saveCreate.error || saveUpdate.error) && <div className="error">Error saving or loading test.</div>}

      <form onSubmit={onSubmit} className="grid two" style={{ gap: 16 }}>
        <div>
          <label>Name</label>
          <input className="input" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label>Type</label>
          <select className="select" name="type" value={form.type} onChange={onChange}>
            <option value="functional">Functional</option>
            <option value="integration">Integration</option>
            <option value="e2e">E2E</option>
            <option value="performance">Performance</option>
          </select>
        </div>
        <div className="grid" style={{ gridColumn: '1 / -1' }}>
          <label>Steps (one per line)</label>
          <textarea className="textarea" name="steps" value={form.steps} onChange={onChange} />
        </div>
        <div className="grid" style={{ gridColumn: '1 / -1' }}>
          <label>Metadata (JSON)</label>
          <textarea className="textarea" name="metadata" value={form.metadata} onChange={onChange} />
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
        {aiGen.error && <div className="error" style={{ marginTop: 8 }}>AI generation failed.</div>}
      </div>
    </div>
  );
}

function tryParseJSON(v) {
  try { return JSON.parse(v); } catch { return v; }
}
