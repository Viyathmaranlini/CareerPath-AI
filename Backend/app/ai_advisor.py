import os
import json
import requests
from app.lk_salary_insights import get_salary_by_role, get_top_paying_roles
from app.roadmap import generate_roadmap

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

def get_ai_career_advice(
    name: str,
    degree: str,
    university: str,
    skills: list,
    experience_years: int,
    target_role: str,
    goal: str
):
    """Claude AI use කරලා personalized Sri Lanka career advice දෙනවා"""
    
    # Sri Lanka salary data ගන්නවා
    salary_info = get_salary_by_role(target_role)
    top_roles = get_top_paying_roles()
    roadmap = generate_roadmap(skills, target_role)
    
    # Context build කරනවා
    context = f"""
You are CareerPath AI — Sri Lanka's first AI-powered career advisor for IT students.
You have access to real Sri Lanka IT market data.

REAL SRI LANKA SALARY DATA:
- Software Engineer: LKR 255,200 - 1,496,000/month
- Data Scientist: LKR 478,500/month avg
- DevOps Engineer: LKR 797,500/month avg
- ML Engineer: LKR 638,000/month avg
- Frontend Developer: LKR 382,800/month avg

TOP PAYING ROLES IN SRI LANKA:
{json.dumps(top_roles[:5], indent=2)}

TARGET ROLE SALARY ({target_role}):
{json.dumps(salary_info, indent=2)}

SKILLS TO LEARN:
{json.dumps(roadmap['roadmap'][:5], indent=2)}

USER PROFILE:
- Name: {name}
- Degree: {degree}
- University: {university}
- Current Skills: {', '.join(skills)}
- Experience: {experience_years} years
- Target Role: {target_role}
- Goal: {goal}

Provide advice in this format:
1. Current Assessment (ඔබේ දැනට situation)
2. Sri Lanka Market Reality (real salary, demand)
3. Top 3 Career Paths with LKR salaries
4. Immediate Action Plan (next 3 months)
5. Long-term Vision (3-5 years)

Be specific, use real LK data, be encouraging but honest.
Mix Sinhala and English naturally.
"""

    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": "claude-sonnet-4-6",
            "max_tokens": 1500,
            "messages": [
                {
                    "role": "user",
                    "content": f"Please give me personalized career advice based on this profile:\n{context}"
                }
            ]
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        return {
            "advice": data["content"][0]["text"],
            "salary_data": salary_info,
            "roadmap_steps": len(roadmap["roadmap"]),
            "status": "success"
        }
    else:
        return {
            "advice": "AI service unavailable. Please check your API key.",
            "status": "error"
        }


if __name__ == "__main__":
    result = get_ai_career_advice(
        name="Viyathmaranlini",
        degree="BSc Computer Science",
        university="SLIIT",
        skills=["python", "html", "css"],
        experience_years=0,
        target_role="software engineer",
        goal="Get a job in Sri Lanka IT sector within 6 months"
    )
    print(result["advice"])