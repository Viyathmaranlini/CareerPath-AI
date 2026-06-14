import sqlite3
from datetime import datetime, timedelta

DB_PATH = "data/careerpath.db"

def get_skill_trend(skill_name, days=30):
    """Skill එකක trend calculate කරනවා"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Last 30 days
    recent_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    cursor.execute("""
        SELECT date, SUM(count) as total
        FROM skill_frequency
        WHERE skill_name = ? AND date >= ?
        GROUP BY date
        ORDER BY date ASC
    """, (skill_name, recent_date))

    results = cursor.fetchall()
    conn.close()
    return results


def get_trending_skills(limit=10):
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Last 30 days vs previous 30 days compare
    today = datetime.now().strftime("%Y-%m-%d")
    days_30 = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    days_60 = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")

    cursor.execute("""
        SELECT 
            skill_name,
            SUM(CASE WHEN date >= ? THEN count ELSE 0 END) as recent,
            SUM(CASE WHEN date < ? AND date >= ? THEN count ELSE 0 END) as previous
        FROM skill_frequency
        GROUP BY skill_name
        HAVING recent > 0
        ORDER BY recent DESC
        LIMIT ?
    """, (days_30, days_30, days_60, limit))

    results = cursor.fetchall()
    conn.close()

    trending = []
    for skill, recent, previous in results:
        if previous > 0:
            growth = ((recent - previous) / previous) * 100
        else:
            growth = 100

        trending.append({
            "skill": skill,
            "recent_count": recent,
            "previous_count": previous,
            "growth_percent": round(growth, 1),
            "status": "🔥 Rising" if growth > 0 else "📉 Declining"
        })

    return trending


if __name__ == "__main__":
    skills = get_trending_skills()
    print("\n📊 Trending Skills:")
    for s in skills:
        print(f"  {s['skill']}: {s['growth_percent']}% {s['status']}")