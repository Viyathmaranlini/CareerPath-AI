from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.trend_analysis import get_trending_skills, get_skill_trend
from app.database import create_tables, get_top_skills

app = FastAPI(title="CareerPath AI API")

# CORS setup (React frontend connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
def startup():
    create_tables()

# Endpoints
@app.get("/")
def root():
    return {"message": "CareerPath AI API Running! 🚀"}

@app.get("/skills/trending")
def trending_skills(limit: int = 10):
    skills = get_trending_skills(limit)
    return {"trending": skills}

@app.get("/skills/top")
def top_skills(limit: int = 10):
    skills = get_top_skills(limit)
    return {"top_skills": skills}

@app.get("/skills/trend/{skill_name}")
def skill_trend(skill_name: str, days: int = 30):
    trend = get_skill_trend(skill_name, days)
    return {
        "skill": skill_name,
        "trend": trend
    }