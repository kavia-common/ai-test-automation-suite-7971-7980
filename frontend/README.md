# AI Test Automation Suite - Frontend

Sidebar-based React application to manage test cases, execute runs (with polling), view reports, and generate AI-powered tests.

## Quick Start

1. Copy `.env.example` to `.env` and adjust variables as needed.
2. Install dependencies:
   - npm install
3. Run the app:
   - npm start
4. The app assumes the backend runs on port 3001 when env is not configured. Set `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL` to override.

## Environment Variables

- REACT_APP_API_BASE: Preferred backend base URL (e.g., http://localhost:3001)
- REACT_APP_BACKEND_URL: Alternate env var supported for backend base
- REACT_APP_HEALTHCHECK_PATH: Health path for backend (defaults to `/`)
- See `.env.example` for the full list supported by this container.

## API Client

Axios-based client derives base URL in this order:
1. REACT_APP_API_BASE
2. REACT_APP_BACKEND_URL
3. Replace current origin port with 3001

Health indicator uses `REACT_APP_HEALTHCHECK_PATH` or `/` if not provided.

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
