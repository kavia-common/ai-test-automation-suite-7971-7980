# ai-test-automation-suite-7971-7980

This workspace contains the React frontend for the AI-enabled testing framework.

Preview defaults:
- Frontend: https://vscode-internal-36116-beta.beta01.cloud.kavia.ai:3000
- Backend: https://vscode-internal-36116-beta.beta01.cloud.kavia.ai:3001 (Flask, with /docs and /openapi.json)

Frontend → Backend integration:
- The frontend derives the backend base URL in this order:
  1. REACT_APP_API_BASE
  2. REACT_APP_BACKEND_URL
  3. Derived from current origin by switching to port 3001
- Healthcheck path defaults to `/` and can be overridden via `REACT_APP_HEALTHCHECK_PATH`.
- A quick link to backend API docs appears in the header and points to `${API_BASE}/docs` unless `REACT_APP_BACKEND_DOCS_URL` is set.

Environment Variables Summary:
- Frontend:
  - REACT_APP_API_BASE
  - REACT_APP_BACKEND_URL
  - REACT_APP_HEALTHCHECK_PATH
  - REACT_APP_BACKEND_DOCS_URL
- Backend:
  - REACT_APP_FRONTEND_URL (set to the frontend origin to control CORS allowlist)

Setup
1. cd frontend
2. cp .env.example .env  (optional to edit; leaving empty is fine in preview)
3. npm install
4. npm start

Backend requirements
- Ensure Flask backend enables CORS for the frontend origin exactly:
  https://vscode-internal-25119-beta.beta01.cloud.kavia.ai:3000
- Expose a health endpoint at `/` (or set `REACT_APP_HEALTHCHECK_PATH` accordingly).
- If OpenAPI docs are available at `/docs`, the header link will open them.

End-to-end smoke flow (from UI)
1. Create a new test (Tests → New Test → Save).
2. Trigger execution (Execute → select test(s) → Start Execution).
3. Polls every ~2s until status is completed/failed/cancelled.
4. View reports (Reports → Details) to see the run summary.

```diff
Important:
- Do not hardcode URLs; prefer environment variables.
- Make sure both frontend and backend use the same scheme (http/https).
```