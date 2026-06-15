import json
import sqlite3
from datetime import datetime

DB_PATH = "data/careerpath.db"

def load_salary_data():
    """lk_salaries.json load කරනවා"""
    try:
        with open("data/raw/lk_salaries.json", "r") as f:
            return json.load(f)
    except:
        return []

def get_salary_by_role(role: str):
    """Role එකට salary insights ගන්නවා"""
    data = load_salary_data()
    filtered = [d for d in data if role.lower() in d["role"].lower()]
    
    if not filtered:
        return {"error": f"No salary data for {role}"}
    
    salaries_lkr = [d["salary_lkr"] for d in filtered]
    salaries_usd = [d["salary_usd"] for d in filtered]
    
    return {
        "role": role,
        "count": len(filtered),
        "salary_lkr": {
            "min": min(salaries_lkr),
            "max": max(salaries_lkr),
            "avg": round(sum(salaries_lkr) / len(salaries_lkr)),
        },
        "salary_usd": {
            "min": min(salaries_usd),
            "max": max(salaries_usd),
            "avg": round(sum(salaries_usd) / len(salaries_usd)),
        },
        "source": "techsalary.tldr.lk",
        "country": "Sri Lanka 🇱🇰"
    }

def get_top_paying_roles():
    """Top paying IT roles Sri Lanka වල"""
    data = load_salary_data()
    
    role_salaries = {}
    for d in data:
        role = d["role"]
        if role not in role_salaries:
            role_salaries[role] = []
        role_salaries[role].append(d["salary_usd"])
    
    result = []
    for role, salaries in role_salaries.items():
        result.append({
            "role": role,
            "avg_salary_usd": round(sum(salaries) / len(salaries)),
            "avg_salary_lkr": round(sum(salaries) / len(salaries) * 319),
        })
    
    return sorted(result, key=lambda x: x["avg_salary_usd"], reverse=True)

def get_salary_by_experience(years: int):
    """Experience level අනුව salary ගන්නවා"""
    data = load_salary_data()
    
    if years <= 2:
        level = "Junior"
        filtered = [d for d in data if d["experience"] <= 2]
    elif years <= 5:
        level = "Mid-level"
        filtered = [d for d in data if 2 < d["experience"] <= 5]
    else:
        level = "Senior"
        filtered = [d for d in data if d["experience"] > 5]
    
    if not filtered:
        return {"error": "No data"}
    
    avg_usd = round(sum(d["salary_usd"] for d in filtered) / len(filtered))
    avg_lkr = round(sum(d["salary_lkr"] for d in filtered) / len(filtered))
    
    return {
        "experience_years": years,
        "level": level,
        "avg_salary_usd": avg_usd,
        "avg_salary_lkr": avg_lkr,
        "note": "Based on Sri Lanka IT market data 🇱🇰"
    }

if __name__ == "__main__":
    print("💰 Top Paying IT Roles in Sri Lanka:")
    roles = get_top_paying_roles()
    for r in roles:
        print(f"  {r['role']}: ${r['avg_salary_usd']}/mo (LKR {r['avg_salary_lkr']:,})")
    
    print("\n📊 Software Engineer Salary:")
    se = get_salary_by_role("Software Engineer")
    print(f"  Min: LKR {se['salary_lkr']['min']:,}")
    print(f"  Avg: LKR {se['salary_lkr']['avg']:,}")
    print(f"  Max: LKR {se['salary_lkr']['max']:,}")