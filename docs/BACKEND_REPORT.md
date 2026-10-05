# Backend Report

## Framework and Setup
- **Framework:** Python FastAPI
- **Language:** Python
- **Entry Point:** `backend/main.py`
- **Run Command:** `uvicorn main:app --reload` (or similar)
- **Port:** Likely 8000 by default (needs to be specified/run with uvicorn)

## API Routes

### 1. `GET /home`
- **Purpose:** Health check / basic verification
- **Request Body:** None
- **Response Shape:** `{"message": "FastAPI Server is running"}`
- **Status Codes:** 200 OK

### 2. `POST /send-prompt`
- **Purpose:** Send a prompt to the Gemini model and get a response.
- **Request Body:** JSON `{"text": "string"}`
- **Response Shape:** `{"response": "string"}`
- **Status Codes:** 200 OK (500 if error)
- **Streaming:** **No.** It returns a single JSON object.

## Gemini API Usage
- **Model:** `gemini-3.8-flash`
- **Client:** `google-genai` SDK
- **System Prompt / Generation Config:** None provided.
- **Chat History:** None handled on the backend. Each request is stateless.
- **Safety Settings:** Default.

## Sessions & Authentication
- **Session/History:** The backend does NOT store history. The frontend will have to handle history.
- **Auth:** No authentication required on the endpoints.
- **Env Variables:** Uses `GEMINI_API_KEY` loaded via `dotenv`.

## Missing Pieces & Proposed Fixes

To properly serve the frontend, the following minimal fixes are needed on the backend:
1. **CORS Configuration:** The frontend will run on a different port (e.g., Vite on 5173). We need to add `CORSMiddleware` to allow cross-origin requests.

### Proposed Minimal Backend Changes:
- Add `CORSMiddleware` in `main.py` to allow `*` or `http://localhost:5173`.
