import api from './client';

// PUBLIC_INTERFACE
export const TestsAPI = {
  /** CRUD for test cases */
  async list() { const { data } = await api.get('/api/tests'); return data; },
  async get(id) { const { data } = await api.get(`/api/tests/${id}`); return data; },
  async create(payload) { const { data } = await api.post('/api/tests', payload); return data; },
  async update(id, payload) { const { data } = await api.put(`/api/tests/${id}`, payload); return data; },
  async remove(id) { const { data } = await api.delete(`/api/tests/${id}`); return data; },
};

// PUBLIC_INTERFACE
export const ExecuteAPI = {
  /** Trigger and poll execution */
  async trigger(payload) { const { data } = await api.post('/api/execute', payload); return data; },
  async status(runId) { const { data } = await api.get(`/api/execute/${runId}/status`); return data; },
};

// PUBLIC_INTERFACE
export const ReportsAPI = {
  /** Reports listing and details */
  async list() { const { data } = await api.get('/api/reports'); return data; },
  async get(id) { const { data } = await api.get(`/api/reports/${id}`); return data; },
};

// PUBLIC_INTERFACE
export const AIGenerateAPI = {
  /** AI Test generation */
  async generate(prompt) { const { data } = await api.post('/api/ai/tests/generate', { prompt }); return data; },
};
