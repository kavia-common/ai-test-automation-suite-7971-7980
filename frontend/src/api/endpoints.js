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
  /** Trigger and poll execution using /api/executions */
  async trigger(payload) { 
    // expected payload: { test_ids: [...] }
    const { data } = await api.post('/api/executions', payload); 
    return data; 
  },
  async status(executionId) { 
    // GET /api/executions/{id}
    const { data } = await api.get(`/api/executions/${executionId}`); 
    return data; 
  },
};

// PUBLIC_INTERFACE
export const ReportsAPI = {
  /** Reports listing and details */
  async list() { const { data } = await api.get('/api/reports'); return data; },
  async get(id) { const { data } = await api.get(`/api/reports/${id}`); return data; },
  // PUBLIC_INTERFACE
  async byExecution(executionId) { 
    const { data } = await api.get(`/api/reports/by-execution/${executionId}`); 
    return data; 
  },
};

// PUBLIC_INTERFACE
export const AIGenerateAPI = {
  /** AI Test generation using POST /api/ai/generate-tests */
  async generate(prompt) { 
    const { data } = await api.post('/api/ai/generate-tests', { prompt }); 
    return data; 
  },
};
