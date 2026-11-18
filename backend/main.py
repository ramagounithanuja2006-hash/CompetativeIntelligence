from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from hindsight import setup_memory
from agent import analyze_competitor_data, ask_agent


app = FastAPI(
    title="CompIntel AI",
    description="Competitive Intelligence Agent powered by Hindsight"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class DataRequest(BaseModel):
    company: str
    source: str
    content: str


class QuestionRequest(BaseModel):
    question: str


@app.on_event("startup")
async def startup():
    await setup_memory()


@app.get("/")
async def home():
    return {
        "status": "online",
        "project": "CompIntel AI",
        "memory": "Hindsight"
    }


@app.post("/api/collect")
async def collect_data(request: DataRequest):

    result = await analyze_competitor_data(
        request.company,
        request.source,
        request.content
    )

    return {
        "success": True,
        "message": "Data analyzed and stored in Hindsight memory.",
        "result": result
    }


@app.post("/api/ask")
async def ask(request: QuestionRequest):

    result = await ask_agent(request.question)

    return {
        "success": True,
        "result": result
    }