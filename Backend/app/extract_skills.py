import json
import os
import re

# Common tech skills list
SKILLS = [
    # Programming Languages
    "python", "javascript", "java", "typescript", "c++", "c#", "golang",
    "ruby", "php", "swift", "kotlin", "rust", "scala",
    
    # Web / Frontend
    "react", "angular", "vue", "html", "css", "nextjs", "tailwind",
    
    # Backend
    "fastapi", "django", "flask", "nodejs", "express", "spring",
    
    # Database
    "postgresql", "mysql", "mongodb", "sqlite", "redis", "firebase",
    
    # Cloud / DevOps
    "aws", "azure", "docker", "kubernetes", "git", "linux", "jenkins",
    
    # Data / AI
    "machine learning", "deep learning", "tensorflow", "pytorch",
    "pandas", "numpy", "scikit-learn", "sql", "tableau", "power bi",
]

def extract_skills_from_text(text):
    text = text.lower()
    found_skills = []
    
    for skill in SKILLS:
        # Word boundary check
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text):
            found_skills.append(skill)
    
    return found_skills


def process_jobs_file(filepath):
    with open(filepath, "r") as f:
        jobs = json.load(f)
    
    results = []
    skill_count = {}
    
    for job in jobs:
        title = job.get("title", "")
        description = job.get("description", "")
        full_text = f"{title} {description}"
        
        skills = extract_skills_from_text(full_text)
        
        results.append({
            "title": title,
            "company": job.get("company", {}).get("display_name", ""),
            "skills": skills
        })
        
        # Count skill frequency
        for skill in skills:
            skill_count[skill] = skill_count.get(skill, 0) + 1
    
    # Sort by most demanded
    sorted_skills = sorted(
        skill_count.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    print("\n🔥 Top 10 Most Demanded Skills:")
    for skill, count in sorted_skills[:10]:
        print(f"  {skill}: {count} jobs")
    
    return results, dict(sorted_skills)


if __name__ == "__main__":
    # Test with sample data
    sample = "We need a Python developer with React and AWS experience."
    skills = extract_skills_from_text(sample)
    print(f"Extracted skills: {skills}")