from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.trend_analysis import get_trending_skills, get_skill_trend
from app.database import create_tables, get_top_skills
from app.forecast import simple_forecast
from app.roadmap import generate_roadmap
from pydantic import BaseModel

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

@app.get("/skills/forecast/{skill_name}")
def skill_forecast(skill_name: str):
    return simple_forecast(skill_name)

# Roadmap Endpoints
class RoadmapRequest(BaseModel):
    current_skills: list[str]
    target_role: str

@app.post("/roadmap/generate")
def create_roadmap(request: RoadmapRequest):
    return generate_roadmap(
        user_skills=request.current_skills,
        target_role=request.target_role
    )

from app.lk_salary_insights import get_salary_by_role, get_top_paying_roles, get_salary_by_experience
from app.lk_scraper import get_techsalary_data

# Sri Lanka Endpoints
@app.get("/lk/salary/{role}")
def lk_salary_by_role(role: str):
    return get_salary_by_role(role)

@app.get("/lk/salary/experience/{years}")
def lk_salary_by_experience(years: int):
    return get_salary_by_experience(years)

@app.get("/lk/top-paying-roles")
def lk_top_paying_roles():
    return {"top_roles": get_top_paying_roles()}

@app.get("/lk/collect-salary-data")
def collect_salary_data():
    data = get_techsalary_data()
    return {"message": f"✅ {len(data)} salary records collected!", "data": data}

from app.ai_advisor import get_ai_career_advice
from pydantic import BaseModel

# AI Career Advisor Endpoint
class CareerAdviceRequest(BaseModel):
    name: str
    degree: str
    university: str
    skills: list[str]
    experience_years: int
    target_role: str
    goal: str

@app.post("/ai/career-advice")
def career_advice(request: CareerAdviceRequest):
    return get_ai_career_advice(
        name=request.name,
        degree=request.degree,
        university=request.university,
        skills=request.skills,
        experience_years=request.experience_years,
        target_role=request.target_role,
        goal=request.goal
    )