from datetime import datetime, timedelta
import sqlite3

DB_PATH = "data/careerpath.db"

def simple_forecast(skill_name, forecast_days=90):
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT date, SUM(count) as total
        FROM skill_frequency
        WHERE skill_name = ?
        GROUP BY date
        ORDER BY date ASC
    """, (skill_name,))

    results = cursor.fetchall()
    conn.close()

    if len(results) < 2:
        return {
            "skill": skill_name,
            "message": "Not enough data to forecast",
            "forecast": []
        }

    # Calculate average daily growth
    counts = [r[1] for r in results]
    avg_count = sum(counts) / len(counts)
    
    # Simple growth rate
    if len(counts) >= 2:
        growth_rate = (counts[-1] - counts[0]) / len(counts)
    else:
        growth_rate = 0

    # Generate forecast
    forecast = []
    last_count = counts[-1]
    last_date = datetime.strptime(results[-1][0], "%Y-%m-%d")

    for i in range(1, forecast_days + 1, 30):
        future_date = last_date + timedelta(days=i)
        predicted = max(0, last_count + (growth_rate * i))
        
        forecast.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "predicted_count": round(predicted),
            "trend": "📈 Rising" if growth_rate > 0 else "📉 Declining"
        })

    return {
        "skill": skill_name,
        "current_demand": last_count,
        "growth_rate": round(growth_rate, 2),
        "forecast": forecast,
        "note": "⚠️ This is a projected trend, not a guarantee"
    }


if __name__ == "__main__":
    result = simple_forecast("python")
    print(f"\n📊 Forecast for Python:")
    for f in result["forecast"]:
        print(f"  {f['date']}: {f['predicted_count']} jobs {f['trend']}")