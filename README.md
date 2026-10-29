# SMART RECRUIT
### End-to-End Resume Parsing and Mock Interview AI
> **"AI + NLP for faster, fairer and more consistent recruitment."**

Smart Recruit is an enterprise-grade AI and Natural Language Processing recruitment platform designed to automate and standardize candidate evaluation, reduce recruiter manual burden, and deliver rigorous, immersive mock interviews.

---

## 📌 Executive Architecture & 5-Step Pipeline

As presented in the system architecture, Smart Recruit implements an end-to-end continuous evaluation pipeline:

```
[ 1. Resume ] ➔ [ 2. AI / NLP ] ➔ [ 3. Ranking ] ➔ [ 4. Interview ] ➔ [ 5. Score ]
```

1. **Resume**: Input ingestion supporting multi-format PDF parsing and PII de-identification.
2. **AI / NLP**: Semantic embedding comparison (S-BERT `all-MiniLM-L6-v2`), entity & skill extraction (spaCy), and experience depth calculation.
3. **Ranking**: Automated candidate ranking board comparing applicant profiles against targeted job openings.
4. **Interview**: Turn-by-turn conversational AI mock interview powered by Gemini with low-latency TTS audio and STT voice recognition.
5. **Score**: Multidimensional evaluation rubric (Technical, Behavioral, Communication, Project Depth) coupled with human-in-the-loop oversight.

---

## 🚀 Key Modules (Slide 6)

The platform is engineered around **8 Core Modules**:

1. **Authentication & Role Switcher**:
   - Multi-role support for **Recruiters / Talent Acquisition** and **Candidates / Students**.
   - Profile management with organizational tenancy.

2. **Resume Parsing**:
   - PDF text extraction, contact information extraction, and entity recognition.
   - **Blind Screening Mode**: Masks candidate names and demographic identifiers to eliminate screening bias.

3. **Resume Analysis**:
   - S-BERT semantic similarity scoring against job requirements.
   - Skill overlap matrix (Matched skills vs. Missing competencies).
   - Experience fit ratio analysis.

4. **Job Management**:
   - Create, edit, list, and delete job openings.
   - Role specifications with required skills, experience level, location, and department categorization.

5. **Candidate Ranking**:
   - Automated candidate pool ranking for any specific job role.
   - Real-time suitability scoring (Overall Match %, S-BERT Similarity, Hard Skills Match).
   - Candidate status management (`Screened`, `Shortlisted`, `Interviewed`, `Rejected`).

6. **Interview Generation**:
   - Dynamic, context-aware interview questions based on candidate resume and job requirements.
   - Text-to-Speech (TTS) audio playback simulating a real professional interviewer.
   - Speech-to-Text (STT) voice recognition with automatic 5-second silence submission.

7. **Interview Evaluation**:
   - Objective turn-by-turn assessment across 4 key dimensions:
     - Technical Depth (0-10)
     - Behavioral & STAR Response (0-10)
     - Communication Clarity (0-10)
     - Project Understanding (0-10)
   - Actionable strengths, weaknesses, and personalized suggestions.

8. **Database & Reporting**:
   - Persistent SQLite database (`smart_recruit.db`) storing users, jobs, resumes, candidate rankings, and interview transcripts.
   - Visual performance dashboard with Radar charts and Radial gauges.
   - **Transparent Score Explainability**: Granular view of algorithmic weights.
   - **Human Oversight Panel**: Recruiter override, shortlisting decision, and notes logging.

---

## 🛡️ Sustainability & Ethics (Slide 5)

Smart Recruit is built around **6 Responsible AI Pillars**:

- **Bias Reduction**: Standardized AI evaluation and one-click Blind / Anonymized Screening.
- **Fairness**: Candidate scoring grounded strictly in relevant technical skills and verified competencies.
- **Privacy & Data Security**: Resumes and transcripts are securely stored in local SQLite database records with PII tokenization.
- **Transparency**: Clear, explainable score breakdown showing exact weights (25% Technical, 25% Behavioral, 25% Communication, 25% Project Depth).
- **Human Oversight**: AI assists recruiters rather than replacing judgment. Recruiters confirm decisions with human notes.
- **Responsible AI Compliance**: Continuous audit logging for system actions and recruiter decisions.

---

## 💼 Market Potential & Business Model (Slide 4)

### Target Segments:
- **Companies & HR**: Automates screening to accelerate hiring velocity and consistency.
- **Recruitment Agencies**: Scale high-volume candidate screening with standardized benchmarking.
- **Startups**: Reduce hiring overhead and identify candidate cultural and technical fit quickly.
- **Placement Cells**: Prepare university students with realistic mock interview feedback and skill gap analysis.

### Business Model:
- **Freemium**: Basic single-resume screening and keyword matching.
- **Subscription**: Advanced S-BERT semantic similarity, voice TTS interviews, and skill gap reporting.
- **B2B Organization**: Multi-seat recruiter accounts, custom job management, and compliance audit logs.

---

## 🛠 Tech Stack

- **Backend**: Python 3.10+, Flask, Flask-CORS, SQLite3
- **AI Models**: Google Gemini 2.5 Flash, Gemini TTS
- **NLP Engine**: Sentence-Transformers / S-BERT (`all-MiniLM-L6-v2`), spaCy (`en_core_web_sm`), FuzzyWuzzy, PyPDF
- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons

---

## ⚙️ Setup and Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Configure your API key in `backend/.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```
4. Start the backend server:
   ```bash
   python app.py
   ```
   *The server runs on `http://localhost:5001`.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/client
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The client runs on `http://localhost:5173`.*

---

## 🔗 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Retrieve all active job openings |
| `POST` | `/api/jobs` | Post a new job role with required skills |
| `DELETE` | `/api/jobs/<id>` | Delete a job opening |
| `GET` | `/api/jobs/<id>/rankings` | Fetch ranked candidate leaderboard for a job |
| `PATCH` | `/api/rankings/<id>/status` | Update candidate status (`Shortlisted`, `Rejected`, etc.) |
| `POST` | `/analyze` | Parse resume PDF, execute S-BERT NLP analysis, and compute fit |
| `POST` | `/start-interview` | Generate first dynamic interview question and synthesize TTS audio |
| `POST` | `/next-question` | Process candidate's answer and generate next contextual question |
| `POST` | `/end-interview` | Conclude interview session and generate multidimensional performance report |
| `GET` | `/api/reports` | Retrieve all saved candidate interview reports |
| `GET` | `/api/reports/<id>` | Retrieve specific candidate evaluation scorecard and transcript |
| `POST` | `/api/reports/<id>/decision` | Save recruiter human oversight decision and review notes |
| `GET` | `/api/ethics-summary` | Get compliance stats, blind screening metrics, and oversight audit |
| `GET` | `/api/audit-logs` | Live immutable transparency and compliance audit trail |
| `GET` | `/api/scalability-stats` | Scalability path KPIs and HR workload reduction analytics |
| `POST` | `/api/practice-session` | Instant student mock interview practice session without PDF upload |

---

## 🤝 Contributors

- **Team 4 - Smart Recruit**
