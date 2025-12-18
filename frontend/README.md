# AI Test Automation Suite - Frontend

Sidebar-based React application to manage test cases, execute runs (with polling), view reports, and generate AI-powered tests.

## Quick Start

1. Copy `.env.example` to `.env` and adjust variables as needed (usually you can leave it empty in preview).
2. Install dependencies:
   - npm install
3. Run the app:
   - npm start
4. Base URL resolution:
   - If `REACT_APP_API_BASE` is set, it is used as the backend base.
   - Else if `REACT_APP_BACKEND_URL` is set, it is used.
   - Else, the app derives the backend base by taking the current page origin and switching the port to `3001`.
   - In the preview environment, this connects `https://...:3000` → `https://...:3001`.

## Environment Variables

- REACT_APP_API_BASE: Preferred backend base URL (e.g., http://localhost:3001)
- REACT_APP_BACKEND_URL: Alternate env var supported for backend base
- REACT_APP_HEALTHCHECK_PATH: Health path for backend (defaults to `/`)
- REACT_APP_BACKEND_DOCS_URL: Optional explicit URL to backend docs (defaults to `${API_BASE}/docs`)
- See `.env.example` for the full list supported by this container.

## API Client

Axios-based client derives base URL in this order:
1. REACT_APP_API_BASE
2. REACT_APP_BACKEND_URL
3. Replace current origin port with 3001

Health indicator uses `REACT_APP_HEALTHCHECK_PATH` or `/` if not provided.
A quick link to the backend API docs is available in the top-right header. It uses `REACT_APP_BACKEND_DOCS_URL` if set, otherwise `${API_BASE}/docs`.

## Preview Integration Notes

- Backend CORS must allow the frontend origin (scheme+host+port `:3000`).
  In this preview, allow exactly: https://vscode-internal-25119-beta.beta01.cloud.kavia.ai:3000
- Healthcheck path defaults to `/`. If your backend exposes a different endpoint (e.g. `/health`), set `REACT_APP_HEALTHCHECK_PATH=/health`.
- Ensure the backend is accessible over the same scheme as the frontend (both http or both https) to avoid mixed content issues.

## Smoke Test (End-to-End)
1. Tests → New Test → fill minimal details → Create Test.
2. Execute → select the created test → Start Execution (polling ~2s).
3. Reports → confirm a new entry appears → Details to view summary.

## Navigation

- Dashboard: Overview with quick stats and actions
- Test Cases: List, create, and edit tests
- Execute: Trigger a run and poll status (HTTP polling)
- Reports: List and view report details
- AI Generate: Integrated into Test Form for drafting tests

## Theme

Corporate Navy (classic, clean):
- Primary: #1E3A8A
- Secondary: #F59E0B
- Success: #059669
- Error: #DC2626
- Background: #F3F4F6
- Surface: #FFFFFF
- Text: #111827

## Notes

- No global state manager; pages use local hooks and a simple `useApi` helper.
- Polling interval for execution status is ~2 seconds; adjust as needed.
- Backend host is never hardcoded; env or derived preview URL is used.
