import requests
import os
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
API_KEY = os.getenv("ADZUNA_API_KEY")

def fetch_jobs(role="software engineer", country="gb", pages=3):
    all_jobs = []
    
    for page in range(1, pages + 1):
        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/{page}"
        params = {
            "app_id": APP_ID,
            "app_key": API_KEY,
            "what": role,
            "results_per_page": 50
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        jobs = data.get("results", [])
        all_jobs.extend(jobs)
        print(f"Page {page}: {len(jobs)} jobs fetched")
    
    # Save to data/raw/
    filename = f"data/raw/jobs_{datetime.now().strftime('%Y%m%d')}.json"
    with open(filename, "w") as f:
        json.dump(all_jobs, f, indent=2)
    
    print(f"Total: {len(all_jobs)} jobs saved to {filename}")
    return all_jobs

if __name__ == "__main__":
    fetch_jobs()