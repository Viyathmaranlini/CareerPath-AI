from datetime import datetime

# Historical Sri Lanka IT skill trend data (2019-2025)
SKILL_HISTORY = {
    "flash": {"2019": 5, "2020": 3, "2021": 1, "2022": 0, "2023": 0, "2024": 0, "2025": 0, "status": "extinct"},
    "jquery": {"2019": 85, "2020": 70, "2021": 55, "2022": 40, "2023": 25, "2024": 15, "2025": 10, "status": "declining"},
    "php": {"2019": 60, "2020": 55, "2021": 48, "2022": 42, "2023": 35, "2024": 30, "2025": 25, "status": "declining"},
    "wordpress": {"2019": 45, "2020": 40, "2021": 38, "2022": 32, "2023": 28, "2024": 22, "2025": 18, "status": "declining"},
    "angularjs": {"2019": 40, "2020": 30, "2021": 20, "2022": 12, "2023": 8, "2024": 5, "2025": 3, "status": "declining"},
    "python": {"2019": 45, "2020": 58, "2021": 70, "2022": 82, "2023": 90, "2024": 95, "2025": 98, "status": "rising"},
    "react": {"2019": 30, "2020": 45, "2021": 60, "2022": 72, "2023": 82, "2024": 88, "2025": 92, "status": "rising"},
    "typescript": {"2019": 15, "2020": 25, "2021": 38, "2022": 52, "2023": 65, "2024": 75, "2025": 82, "status": "rising"},
    "docker": {"2019": 20, "2020": 32, "2021": 45, "2022": 58, "2023": 70, "2024": 78, "2025": 85, "status": "rising"},
    "aws": {"2019": 25, "2020": 38, "2021": 52, "2022": 65, "2023": 75, "2024": 82, "2025": 88, "status": "rising"},
    "machine learning": {"2019": 15, "2020": 25, "2021": 38, "2022": 52, "2023": 65, "2024": 78, "2025": 85, "status": "rising"},
    "kubernetes": {"2019": 10, "2020": 18, "2021": 28, "2022": 40, "2023": 55, "2024": 65, "2025": 72, "status": "rising"},
    "vue": {"2019": 20, "2020": 28, "2021": 35, "2022": 38, "2023": 40, "2024": 38, "2025": 35, "status": "stable"},
    "java": {"2019": 75, "2020": 72, "2021": 68, "2022": 65, "2023": 62, "2024": 58, "2025": 55, "status": "stable"},
    "sql": {"2019": 80, "2020": 80, "2021": 78, "2022": 78, "2023": 75, "2024": 75, "2025": 73, "status": "stable"},
}

def predict_skill_future(skill_name: str):
    """Skill එකක future demand predict කරනවා"""
    skill = skill_name.lower()
    
    if skill not in SKILL_HISTORY:
        return {"error": f"'{skill_name}' skill data නෑ"}
    
    data = SKILL_HISTORY[skill]
    status = data["status"]
    
    years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"]
    values = [data[y] for y in years]
    
    # Growth rate calculate
    recent_growth = values[-1] - values[-3]
    
    # 2026-2028 predict
    predictions = {}
    last_val = values[-1]
    for i, year in enumerate(["2026", "2027", "2028"], 1):
        if status == "rising":
            predicted = min(100, last_val + (recent_growth * i * 0.7))
        elif status == "declining":
            predicted = max(0, last_val + (recent_growth * i * 0.8))
        elif status == "extinct":
            predicted = 0
        else:
            predicted = last_val + (recent_growth * i * 0.3)
        predictions[year] = round(predicted)
    
    # Risk level
    if status == "extinct":
        risk = "💀 EXTINCT"
        advice = "මේ skill use කරන්නේ නැහැ!"
        color = "#6b7280"
    elif status == "declining" and values[-1] < 30:
        risk = "🔴 HIGH RISK"
        advice = "ඉක්මනින් modern alternative ඉගෙනගන්න!"
        color = "#ef4444"
    elif status == "declining":
        risk = "🟡 MEDIUM RISK"
        advice = "Complementary skills add කරන්න"
        color = "#f59e0b"
    elif status == "rising":
        risk = "🟢 SAFE & GROWING"
        advice = "දැන් ඉගෙනගන්න — high demand!"
        color = "#10b981"
    else:
        risk = "🔵 STABLE"
        advice = "Safe — හැබැයි growth low"
        color = "#3b82f6"
    
    return {
        "skill": skill_name,
        "status": status,
        "risk_level": risk,
        "advice": advice,
        "color": color,
        "historical_data": {y: data[y] for y in years},
        "predictions": predictions,
        "current_demand": values[-1],
        "trend": f"{'+' if recent_growth > 0 else ''}{recent_growth}% (last 2 years)"
    }


def get_extinction_report(user_skills: list):
    """User skills analyze කරලා extinction report දෙනවා"""
    report = {
        "safe": [],
        "at_risk": [],
        "extinct": [],
        "unknown": []
    }
    
    for skill in user_skills:
        result = predict_skill_future(skill)
        if "error" in result:
            report["unknown"].append(skill)
        elif result["status"] == "extinct":
            report["extinct"].append(result)
        elif result["status"] == "declining":
            report["at_risk"].append(result)
        else:
            report["safe"].append(result)
    
    return report


if __name__ == "__main__":
    print("☠️ Skill Extinction Predictor — Sri Lanka IT Market\n")
    
    test_skills = ["jquery", "python", "flash", "react", "php"]
    for skill in test_skills:
        result = predict_skill_future(skill)
        if "error" not in result:
            print(f"{result['risk_level']} — {skill.upper()}")
            print(f"   Current: {result['current_demand']}% demand")
            print(f"   2028 prediction: {result['predictions']['2028']}%")
            print(f"   Advice: {result['advice']}\n")