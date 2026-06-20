from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.trend_analysis import get_trending_skills, get_skill_trend
from app.database import create_tables, get_top_skills
from app.forecast import simple_forecast
from app.roadmap import generate_roadmap
from pydantic import BaseModel
from app.lk_salary_insights import get_salary_by_role, get_top_paying_roles, get_salary_by_experience
from app.lk_scraper import get_techsalary_data
from app.ai_advisor import get_ai_career_advice
from pydantic import BaseModel
from app.skill_extinction import predict_skill_future, get_extinction_report

app = FastAPI(title="CareerPath AI API")

# CORS setup (React frontend connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
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

@app.get("/skills/extinction/{skill_name}")
def skill_extinction(skill_name: str):
    return predict_skill_future(skill_name)

from app.auth import (
    create_auth_tables, create_user, get_user_by_email, get_user_by_id,
    verify_password, create_access_token, decode_access_token,
    save_roadmap, get_user_roadmaps, delete_roadmap
)
from fastapi import Depends, HTTPException, Header
import json

# Update startup to create auth tables too
@app.on_event("startup")
def startup_auth():
    create_auth_tables()

# --- Auth Models ---
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SaveRoadmapRequest(BaseModel):
    target_role: str
    roadmap_data: dict

# --- Auth Helper ---
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = get_user_by_id(payload.get("user_id"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# --- Auth Endpoints ---
@app.post("/auth/signup")
def signup(request: SignupRequest):
    if len(request.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    user_id, error = create_user(request.name, request.email, request.password)
    
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    token = create_access_token({"user_id": user_id, "email": request.email})
    
    return {
        "access_token": token,
        "user": {"id": user_id, "name": request.name, "email": request.email}
    }

@app.post("/auth/login")
def login(request: LoginRequest):
    user = get_user_by_email(request.email)
    
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"user_id": user["id"], "email": user["email"]})
    
    return {
        "access_token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
    }

@app.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --- Saved Roadmaps Endpoints ---
@app.post("/roadmap/save")
def save_user_roadmap(request: SaveRoadmapRequest, current_user: dict = Depends(get_current_user)):
    roadmap_id = save_roadmap(
        user_id=current_user["id"],
        target_role=request.target_role,
        roadmap_data=json.dumps(request.roadmap_data)
    )
    return {"message": "Roadmap saved!", "roadmap_id": roadmap_id}

@app.get("/roadmap/saved")
def get_saved_roadmaps(current_user: dict = Depends(get_current_user)):
    roadmaps = get_user_roadmaps(current_user["id"])
    for r in roadmaps:
        r["roadmap_data"] = json.loads(r["roadmap_data"])
    return {"roadmaps": roadmaps}

@app.delete("/roadmap/saved/{roadmap_id}")
def delete_saved_roadmap(roadmap_id: int, current_user: dict = Depends(get_current_user)):
    success = delete_roadmap(roadmap_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return {"message": "Roadmap deleted!"}