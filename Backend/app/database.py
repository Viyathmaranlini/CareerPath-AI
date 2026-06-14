import sqlite3
from datetime import datetime

DB_PATH = "data/careerpath.db"

def create_tables():
  
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Skills table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            skill_name TEXT UNIQUE NOT NULL
        )
    """)
    
    # Skill frequency table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skill_frequency (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            skill_name TEXT NOT NULL,
            count INTEGER DEFAULT 0,
            date TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database tables created!")


def save_skill_frequency(skill_count: dict):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    today = datetime.now().strftime("%Y-%m-%d")
    
    for skill, count in skill_count.items():
        cursor.execute("""
            INSERT INTO skill_frequency (skill_name, count, date)
            VALUES (?, ?, ?)
        """, (skill, count, today))
    
    conn.commit()
    conn.close()
    print(f"✅ {len(skill_count)} skills saved to database!")


def get_top_skills(limit=10):
    """Top skills database එකෙන් ගන්නවා"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT skill_name, SUM(count) as total
        FROM skill_frequency
        GROUP BY skill_name
        ORDER BY total DESC
        LIMIT ?
    """, (limit,))
    
    results = cursor.fetchall()
    conn.close()
    return results


if __name__ == "__main__":
    create_tables()
    print("Database ready! ✅")