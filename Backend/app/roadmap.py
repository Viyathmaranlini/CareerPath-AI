import sqlite3

DB_PATH = "data/careerpath.db"

# Learning resources database
RESOURCES = {
    "python": {
        "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        "platform": "freeCodeCamp",
        "hours": 8,
        "free": True
    },
    "javascript": {
        "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        "platform": "freeCodeCamp",
        "hours": 10,
        "free": True
    },
    "react": {
        "url": "https://react.dev/learn",
        "platform": "React Official Docs",
        "hours": 12,
        "free": True
    },
    "docker": {
        "url": "https://www.freecodecamp.org/news/the-docker-handbook/",
        "platform": "freeCodeCamp",
        "hours": 6,
        "free": True
    },
    "aws": {
        "url": "https://aws.amazon.com/training/",
        "platform": "AWS Official",
        "hours": 20,
        "free": True
    },
    "machine learning": {
        "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
        "platform": "Kaggle",
        "hours": 15,
        "free": True
    },
    "sql": {
        "url": "https://www.kaggle.com/learn/intro-to-sql",
        "platform": "Kaggle",
        "hours": 5,
        "free": True
    },
    "typescript": {
        "url": "https://www.typescriptlang.org/docs/",
        "platform": "Official Docs",
        "hours": 8,
        "free": True
    },
    "kubernetes": {
        "url": "https://kubernetes.io/docs/tutorials/",
        "platform": "Official Docs",
        "hours": 10,
        "free": True
    },
    "postgresql": {
        "url": "https://www.postgresqltutorial.com/",
        "platform": "PostgreSQL Tutorial",
        "hours": 6,
        "free": True
    },
}


def get_skill_demand(skill_name):
   
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT SUM(count) as total
        FROM skill_frequency
        WHERE skill_name = ?
    """, (skill_name,))

    result = cursor.fetchone()
    conn.close()
    return result[0] if result[0] else 0


def generate_roadmap(user_skills: list, target_role: str):
   

    ROLE_SKILLS = {
        "software engineer": [
            "python", "javascript", "react", "docker",
            "aws", "sql", "typescript", "git"
        ],
        "data scientist": [
            "python", "machine learning", "sql", "pandas",
            "numpy", "tensorflow", "tableau"
        ],
        "devops engineer": [
            "docker", "kubernetes", "aws", "linux",
            "python", "jenkins", "git"
        ],
        "frontend developer": [
            "javascript", "react", "typescript",
            "html", "css", "nextjs"
        ],
    }

    target_role_lower = target_role.lower()
    required_skills = ROLE_SKILLS.get(
        target_role_lower,
        ["python", "javascript", "sql", "git"]
    )

    user_skills_lower = [s.lower() for s in user_skills]

    gap_skills = [
        s for s in required_skills
        if s not in user_skills_lower
    ]

    roadmap = []

    for skill in gap_skills:
        demand = get_skill_demand(skill)
        resource = RESOURCES.get(skill, {
            "url": f"https://www.google.com/search?q=learn+{skill}",
            "platform": "Google Search",
            "hours": 10,
            "free": True
        })

        roadmap.append({
            "skill": skill,
            "demand_score": demand,
            "hours_to_learn": resource["hours"],
            "resource_url": resource["url"],
            "platform": resource["platform"],
            "free": resource["free"],
            "priority": "🔥 High" if demand > 50 else "📈 Medium"
        })

    roadmap.sort(key=lambda x: x["demand_score"], reverse=True)

    return {
        "target_role": target_role,
        "current_skills": user_skills,
        "skills_to_learn": len(gap_skills),
        "roadmap": roadmap
    }


if __name__ == "__main__":
    result = generate_roadmap(
        user_skills=["python", "html", "css"],
        target_role="software engineer"
    )

    print(f"\n🗺️ Roadmap for: {result['target_role']}")
    print(f"Skills to learn: {result['skills_to_learn']}\n")

    for i, step in enumerate(result["roadmap"], 1):
        print(f"{i}. {step['skill'].upper()}")
        print(f"   Priority: {step['priority']}")
        print(f"   Time: {step['hours_to_learn']} hours")
        print(f"   Learn: {step['resource_url']}\n")