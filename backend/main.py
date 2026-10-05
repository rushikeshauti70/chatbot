from fastapi import FastAPI

from pydantic import BaseModel

import google.generativeai as genai

from dotenv import load_dotenv

import os

load_dotenv()


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Prompt(BaseModel):

    text: str


@app.get("/home")
def home():

    return {"message": "FastAPI Server is running"}


@app.post("/send-prompt")
def send_prompt(prompt: Prompt):

    response = model.generate_content(prompt.text)

    print(response.text)

    return {"response": response.text}