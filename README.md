# Gemini Chatbot

A full-stack AI chatbot powered by the Google Gemini API, featuring a React + Vite frontend and a Python FastAPI backend.

## Features
- Modern Chat UI with Dark/Light mode
- Markdown and syntax-highlighted code block rendering
- Local history storage
- Gemini 1.5 Flash model integration

## Quick Start

### 1. Backend Setup
1. Navigate to the `backend` folder.
2. Activate your virtual environment (e.g. `.\venv\Scripts\Activate.ps1`).
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file and add your `GEMINI_API_KEY`.
5. Run the server: `uvicorn main:app --reload --port 8000`

### 2. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the Vite server: `npm run dev`
4. Open your browser to the URL provided (usually `http://localhost:5173`).
