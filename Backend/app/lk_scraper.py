import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

def scrape_ikman_jobs(pages=3):
    """ikman.lk වලින් Sri Lanka IT jobs scrape කරනවා"""
    all_jobs = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    for page in range(1, pages + 1):
        url = f"https://ikman.lk/en/ads/sri-lanka/jobs?sort=date&order=desc&buy_now=0&urgent=0&page={page}"
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            job_cards = soup.find_all('li', class_='normal--X2qFm')
            
            for card in job_cards:
                try:
                    title = card.find('h2')
                    location = card.find('span', class_='locationText--1M5Oi')
                    price = card.find('span', class_='price--3SnqI')
                    
                    if title:
                        all_jobs.append({
                            "title": title.text.strip(),
                            "location": location.text.strip() if location else "Sri Lanka",
                            "salary": price.text.strip() if price else "Negotiable",
                            "source": "ikman.lk",
                            "date": datetime.now().strftime("%Y-%m-%d")
                        })
                except:
                    continue
                    
            print(f"Page {page}: {len(job_cards)} jobs found")
            time.sleep(2)  # Polite scraping
            
        except Exception as e:
            print(f"Error on page {page}: {e}")
            continue

    # Save to file
    with open("data/raw/lk_jobs.json", "w") as f:
        json.dump(all_jobs, f, indent=2)
    
    print(f"\n✅ Total: {len(all_jobs)} LK jobs saved!")
    return all_jobs


def get_techsalary_data():
    """techsalary.tldr.lk වලින් Sri Lanka IT salary data ගන්නවා"""
    
    # Real data from techsalary.tldr.lk (manually curated)
    salary_data = [
        {"role": "Software Engineer", "experience": 2, "salary_usd": 800, "salary_lkr": 255200, "tech": "JavaScript"},
        {"role": "Software Engineer", "experience": 4, "salary_usd": 2000, "salary_lkr": 638000, "tech": "JavaScript"},
        {"role": "Senior Software Engineer", "experience": 10, "salary_usd": 2100, "salary_lkr": 669900, "tech": "C#"},
        {"role": "Software Engineer", "experience": 8, "salary_usd": 4000, "salary_lkr": 1496000, "tech": "PHP"},
        {"role": "Software Engineer", "experience": 5, "salary_usd": 3000, "salary_lkr": 1122000, "tech": "PHP"},
        {"role": "Software Engineer", "experience": 2, "salary_usd": 3200, "salary_lkr": 1020800, "tech": "Python"},
        {"role": "Data Scientist", "experience": 3, "salary_usd": 1500, "salary_lkr": 478500, "tech": "Python"},
        {"role": "DevOps Engineer", "experience": 4, "salary_usd": 2500, "salary_lkr": 797500, "tech": "AWS"},
        {"role": "Frontend Developer", "experience": 2, "salary_usd": 1200, "salary_lkr": 382800, "tech": "React"},
        {"role": "ML Engineer", "experience": 3, "salary_usd": 2000, "salary_lkr": 638000, "tech": "Python"},
        {"role": "QA Engineer", "experience": 3, "salary_usd": 1000, "salary_lkr": 319000, "tech": "Selenium"},
        {"role": "Backend Developer", "experience": 5, "salary_usd": 2800, "salary_lkr": 893200, "tech": "Java"},
    ]
    
    with open("data/raw/lk_salaries.json", "w") as f:
        json.dump(salary_data, f, indent=2)
    
    print(f"✅ {len(salary_data)} salary records saved!")
    return salary_data


if __name__ == "__main__":
    print("🇱🇰 Sri Lanka Data Collection Starting...")
    print("\n1. Collecting salary data...")
    get_techsalary_data()
    print("\n2. Scraping job listings...")
    scrape_ikman_jobs(pages=2)
    print("\n✅ Sri Lanka data collection complete!")