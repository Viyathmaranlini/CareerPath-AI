import sqlite3

DB_PATH = "data/careerpath.db"

SKILL_DATA = {
    "python": {
        "hours": 8, "difficulty": "Easy", "free": True,
        "salary_boost": 15000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=_uQrJ0TkZlc",
            "coursera": "https://www.coursera.org/learn/python",
            "github": "https://github.com/TheAlgorithms/Python"
        },
        "extinction_risk": "safe"
    },
    "javascript": {
        "hours": 10, "difficulty": "Easy", "free": True,
        "salary_boost": 18000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=PkZNo7MFNFg",
            "coursera": "https://www.coursera.org/learn/javascript-basics",
            "github": "https://github.com/ryanmcdermott/clean-code-javascript"
        },
        "extinction_risk": "safe"
    },
    "react": {
        "hours": 12, "difficulty": "Medium", "free": True,
        "salary_boost": 25000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=bMknfKXIFA8",
            "coursera": "https://www.coursera.org/learn/react-basics",
            "github": "https://github.com/enaqx/awesome-react"
        },
        "extinction_risk": "safe"
    },
    "typescript": {
        "hours": 8, "difficulty": "Medium", "free": True,
        "salary_boost": 20000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=BwuLxPH8IDs",
            "coursera": "https://www.coursera.org/learn/typescript",
            "github": "https://github.com/microsoft/TypeScript"
        },
        "extinction_risk": "safe"
    },
    "docker": {
        "hours": 6, "difficulty": "Medium", "free": True,
        "salary_boost": 30000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=3c-iBn73dDE",
            "coursera": "https://www.coursera.org/learn/docker-fundamentals",
            "github": "https://github.com/veggiemonk/awesome-docker"
        },
        "extinction_risk": "safe"
    },
    "aws": {
        "hours": 20, "difficulty": "Hard", "free": False,
        "salary_boost": 50000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=ulprqHHWlng",
            "coursera": "https://www.coursera.org/learn/aws-fundamentals",
            "github": "https://github.com/open-guides/og-aws"
        },
        "extinction_risk": "safe"
    },
    "sql": {
        "hours": 5, "difficulty": "Easy", "free": True,
        "salary_boost": 12000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=HXV3zeQKqGY",
            "coursera": "https://www.kaggle.com/learn/intro-to-sql",
            "github": "https://github.com/TheAlgorithms/SQL"
        },
        "extinction_risk": "stable"
    },
    "machine learning": {
        "hours": 15, "difficulty": "Hard", "free": True,
        "salary_boost": 40000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=i_LwzRVP7bg",
            "coursera": "https://www.coursera.org/learn/machine-learning",
            "github": "https://github.com/josephmisiti/awesome-machine-learning"
        },
        "extinction_risk": "safe"
    },
    "kubernetes": {
        "hours": 10, "difficulty": "Hard", "free": True,
        "salary_boost": 35000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=X48VuDVv0do",
            "coursera": "https://www.coursera.org/learn/google-kubernetes-engine",
            "github": "https://github.com/kelseyhightower/kubernetes-the-hard-way"
        },
        "extinction_risk": "safe"
    },
    "git": {
        "hours": 4, "difficulty": "Easy", "free": True,
        "salary_boost": 8000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=RGOj5yH7evk",
            "coursera": "https://www.coursera.org/learn/version-control-with-git",
            "github": "https://github.com/git-tips/tips"
        },
        "extinction_risk": "safe"
    },
    "nextjs": {
        "hours": 10, "difficulty": "Medium", "free": True,
        "salary_boost": 28000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=mTz0GXj8NN0",
            "coursera": "https://www.coursera.org/learn/nextjs",
            "github": "https://github.com/vercel/next.js"
        },
        "extinction_risk": "safe"
    },
    "jquery": {
        "hours": 5, "difficulty": "Easy", "free": True,
        "salary_boost": 5000,
        "resources": {
            "youtube": "https://youtube.com/watch?v=BWXggB-T1jQ",
            "coursera": "https://www.coursera.org/learn/jquery",
            "github": "https://github.com/jquery/jquery"
        },
        "extinction_risk": "declining"
    },
}

ROLE_SKILLS = {
    "software engineer": ["python", "javascript", "react", "docker", "aws", "sql", "typescript", "git"],
    "data scientist": ["python", "machine learning", "sql", "numpy", "tensorflow", "tableau"],
    "devops engineer": ["docker", "kubernetes", "aws", "linux", "python", "jenkins", "git"],
    "frontend developer": ["javascript", "react", "typescript", "html", "css", "nextjs"],
}

DIFFICULTY_COLORS = {
    "Easy": "#10b981",
    "Medium": "#f59e0b",
    "Hard": "#ef4444"
}

EXTINCTION_COLORS = {
    "safe": "#10b981",
    "stable": "#4f8ef7",
    "declining": "#ef4444",
    "extinct": "#6b7280"
}

def generate_roadmap(user_skills: list, target_role: str):
    required_skills = ROLE_SKILLS.get(target_role.lower(), ["python", "javascript", "sql", "git"])
    user_skills_lower = [s.lower() for s in user_skills]
    gap_skills = [s for s in required_skills if s not in user_skills_lower]

    # Base salary for role
    base_salaries = {
        "software engineer": 120000,
        "data scientist": 150000,
        "devops engineer": 140000,
        "frontend developer": 110000,
    }
    base_salary = base_salaries.get(target_role.lower(), 100000)

    roadmap = []
    total_hours = 0
    cumulative_salary = base_salary

    for i, skill in enumerate(gap_skills):
        data = SKILL_DATA.get(skill, {
            "hours": 10, "difficulty": "Medium", "free": True,
            "salary_boost": 10000,
            "resources": {
                "youtube": f"https://www.youtube.com/results?search_query=learn+{skill}",
                "coursera": f"https://www.coursera.org/search?query={skill}",
                "github": f"https://github.com/search?q={skill}"
            },
            "extinction_risk": "unknown"
        })

        total_hours += data["hours"]
        cumulative_salary += data["salary_boost"]

        # Week calculation
        week_start = sum(SKILL_DATA.get(gap_skills[j], {"hours": 10})["hours"] for j in range(i)) // 10 + 1
        week_end = week_start + max(1, data["hours"] // 10)

        roadmap.append({
            "skill": skill,
            "difficulty": data["difficulty"],
            "difficulty_color": DIFFICULTY_COLORS.get(data["difficulty"], "#4f8ef7"),
            "hours_to_learn": data["hours"],
            "free": data["free"],
            "salary_boost": data["salary_boost"],
            "cumulative_salary": cumulative_salary,
            "resources": data["resources"],
            "extinction_risk": data["extinction_risk"],
            "extinction_color": EXTINCTION_COLORS.get(data["extinction_risk"], "#4f8ef7"),
            "week_range": f"Week {week_start}-{week_end}",
            "priority": "🔥 High" if data["salary_boost"] > 25000 else "📈 Medium",
            "demand_score": 50
        })

    # Sort by salary boost
    roadmap.sort(key=lambda x: x["salary_boost"], reverse=True)

    return {
        "target_role": target_role,
        "current_skills": user_skills,
        "skills_to_learn": len(gap_skills),
        "total_hours": total_hours,
        "total_weeks": max(1, total_hours // 10),
        "base_salary_lkr": base_salary,
        "final_salary_lkr": cumulative_salary,
        "salary_increase": cumulative_salary - base_salary,
        "roadmap": roadmap
    }