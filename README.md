<div align="center">

<img src="https://img.shields.io/badge/CareerPath-AI-blue?style=for-the-badge&logo=graduation-cap&logoColor=white" alt="CareerPath AI"/>

# 🎓 CareerPath AI

### Sri Lanka's First AI-Powered Career Intelligence Platform

*Know Your Career Future — Before It Happens*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Sri Lanka](https://img.shields.io/badge/Made%20in-Sri%20Lanka%20🇱🇰-orange?style=flat-square)](https://github.com/Viyathmaranlini)

<br/>

[🚀 Live Demo](#) · [📖 Docs](#setup) · [🐛 Report Bug](../../issues) · [💡 Request Feature](../../issues)

</div>

---

## 📌 Problem Statement

> Students in Sri Lanka learn skills **without knowing future market demand**.
> There is **no local platform** that provides data-driven career guidance
> in all three official languages.

**CareerPath AI solves this** by analyzing real Sri Lanka job market data,
predicting skill extinction, and building personalized AI-powered career roadmaps.

---

## ✨ Features

<table>
<tr>
<td>

### 📊 Job Market Analysis
Real-time analysis of Sri Lanka IT job postings from ikman.lk, TopJobs.lk and more. Identify what skills employers actually want.

</td>
<td>

### ☠️ Skill Extinction Predictor
Historical data from 2019-2028 forecast. Know which skills are dying before you invest time learning them.

</td>
</tr>
<tr>
<td>

### 🤖 AI Career Advisor
Powered by Claude AI (Anthropic). Get personalized career advice based on your profile, skills, and Sri Lanka market data.

</td>
<td>

### 🗺️ Learning Roadmap
Skill gap analysis with difficulty levels, extinction risk warnings, salary boost predictions and free resource links.

</td>
</tr>
<tr>
<td>

### 💰 Sri Lanka Salary Intelligence
Real LKR salary data from techsalary.tldr.lk. Know exactly what you'll earn at each career stage.

</td>
<td>

### 🌐 Trilingual Support
Built for all Sri Lankans — available in **English**, **සිංහල** and **தமிழ்**. First career platform to support all 3 languages.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + TypeScript + Vite | UI & User Experience |
| **Styling** | Custom CSS Design System | Dark Professional Theme |
| **Backend** | Python + FastAPI | REST API |
| **NLP** | spaCy | Skill Extraction |
| **Database** | SQLite → PostgreSQL | Data Storage |
| **AI** | Claude API (Anthropic) | Career Advice |
| **Charts** | Recharts | Data Visualization |
| **Data Sources** | ikman.lk, techsalary.tldr.lk | Real LK Market Data |

---

## 📁 Project Structure


## 🚀 Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Viyathmaranlini/CareerPath-AI.git
cd CareerPath-AI

# Setup backend
cd Backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys:
# ANTHROPIC_API_KEY=your_key_here

# Run backend
python -m uvicorn app.main:app --reload
# API running at http://localhost:8000
```

### Frontend Setup
```bash
# Setup frontend
cd Frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### API Documentation
Once running, visit `http://localhost:8000/docs` for interactive API docs.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/skills/trending` | Top trending skills |
| GET | `/skills/top` | Most demanded skills |
| GET | `/skills/extinction/{skill}` | Extinction forecast |
| GET | `/lk/salary/{role}` | LK salary by role |
| GET | `/lk/top-paying-roles` | Top paying IT roles |
| POST | `/roadmap/generate` | Generate learning roadmap |
| POST | `/ai/career-advice` | AI career advice |

---

## 📊 Screenshots

> *Coming soon — deployment in progress*

---

## 🗺️ Roadmap

- [x] Job data pipeline
- [x] Skill extraction engine
- [x] Trend analysis + forecasting
- [x] AI Career Advisor (Claude API)
- [x] Skill Extinction Predictor
- [x] Sri Lanka salary data
- [x] Professional dark UI
- [x] Trilingual support (EN/SI/TA)
- [ ] Adzuna API integration
- [ ] User authentication
- [ ] Deploy to production (Vercel + Railway)
- [ ] Mobile app (React Native)
- [ ] Research paper publication

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ for Sri Lanka 🇱🇰**

**Viyathmaranlini** · [GitHub](https://github.com/Viyathmaranlini)

© 2025 CareerPath AI. All rights reserved.

⭐ *Star this repo if you find it helpful!*

</div>
