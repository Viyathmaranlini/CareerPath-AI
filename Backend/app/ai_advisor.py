import os
import json
from dotenv import load_dotenv
from app.lk_salary_insights import get_salary_by_role, get_top_paying_roles
from app.roadmap import generate_roadmap

load_dotenv()

def get_ai_career_advice(
    name: str,
    degree: str,
    university: str,
    skills: list,
    experience_years: int,
    target_role: str,
    goal: str
):
    salary_info = get_salary_by_role(target_role)
    top_roles = get_top_paying_roles()
    roadmap = generate_roadmap(skills, target_role)
    
    skills_str = ', '.join(skills) if skills else 'None yet'
    skills_count = len(skills)
    roadmap_count = len(roadmap["roadmap"])
    
    # Experience level
    if experience_years == 0:
        level = "Fresher"
        salary_start = "LKR 80,000 - 150,000"
    elif experience_years <= 2:
        level = "Junior"
        salary_start = "LKR 150,000 - 250,000"
    elif experience_years <= 5:
        level = "Mid-level"
        salary_start = "LKR 250,000 - 500,000"
    else:
        level = "Senior"
        salary_start = "LKR 500,000 - 1,000,000+"

    advice = f"""
## 🎯 CareerPath AI — {name} ගේ Career Analysis

---

### 1️⃣ Current Assessment (ඔබේ දැනට situation)

**{name}**, ඔබ **{university}** වලින් **{degree}** කරනවා — හොඳ foundation එකක් තියෙනවා! 🎓

- **Level:** {level} ({experience_years} years experience)
- **Current Skills:** {skills_str} ({skills_count} skills)
- **Skills Gap:** {roadmap_count} skills ඉගෙනගන්න තියෙනවා
- **Goal:** {goal}

---

### 2️⃣ Sri Lanka Market Reality 🇱🇰

**{target_role.title()}** role Sri Lanka වල දැන්:

- **Entry Level:** {salary_start}/month
- **Mid Level:** LKR 300,000 - 600,000/month  
- **Senior Level:** LKR 600,000 - 1,500,000/month
- **Remote (USD):** $800 - $3,000/month

**Market Demand:** 🔥 High — IT sector Sri Lanka වල growing!

---

### 3️⃣ Top 3 Career Paths

**Path A: 🏢 Local IT Company**
- Start: LKR 80,000 - 150,000/month
- 3 years later: LKR 300,000 - 500,000/month
- Pros: Experience, stability, mentorship
- Best for: Fresh graduates

**Path B: 🌍 Remote Work**
- Start: $500 - $1,000/month
- 2 years later: $1,500 - $3,000/month  
- Pros: High salary, flexibility
- Best for: Strong portfolio holders

**Path C: 💼 Freelancing**
- Start: LKR 50,000 - 100,000/month
- 2 years later: LKR 200,000 - 600,000/month
- Pros: Freedom, variety
- Best for: Self-motivated people

---

### 4️⃣ Immediate Action Plan (Next 3 Months) 📅

**Month 1:**
- {roadmap['roadmap'][0]['skill'].upper() if roadmap_count > 0 else 'Core skill'} ඉගෙනගන්න
- GitHub profile setup කරන්න
- LinkedIn profile හදන්න

**Month 2:**
- {roadmap['roadmap'][1]['skill'].upper() if roadmap_count > 1 else 'Second skill'} ඉගෙනගන්න
- Portfolio project 1 build කරන්න
- Open source contribute කරන්න

**Month 3:**
- Portfolio project 2 complete කරන්න
- TopJobs.lk, ikman.lk apply කරන්න
- 20+ companies ට applications දෙන්න

---

### 5️⃣ Long-term Vision (3-5 Years) 🚀

**Year 1:** Junior {target_role.title()} — LKR 150,000/month
**Year 2:** Mid {target_role.title()} — LKR 300,000/month  
**Year 3:** Senior {target_role.title()} — LKR 500,000/month
**Year 5:** Tech Lead / Remote — LKR 800,000+ හෝ $3,000+/month

---

> 💡 **CareerPath AI Tip:** Sri Lanka IT market rapidly growing!
> දැන් invest කරන skills 3 years later 3x-5x return දෙනවා! 💪

*Data source: techsalary.tldr.lk, Sri Lanka IT industry reports 2024-2025*
    """

    return {
        "advice": advice,
        "salary_data": salary_info,
        "roadmap_steps": roadmap_count,
        "status": "success"
    }