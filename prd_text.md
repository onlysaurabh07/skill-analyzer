📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
🧠 Product Name
SkillGap AI – Smart Career Gap Analyzer
🎯 1. Objective
Build a web app that helps users identify the gap between their current skills and target job requirements, and provides a personalized roadmap to bridge that gap.
👥 2. Target Users
🎓 College students (CS, IT, etc.)
💼 Job seekers / freshers
🔁 Career switchers
🧑‍💻 Self-learners
❗ 3. Problem Statement
Users don’t know:
What skills they are missing
What to learn next
How far they are from their dream job
👉 Current platforms (LinkedIn, job portals) don’t give clear skill-gap insights
💡 4. Solution Overview
User uploads:
Resume (PDF / text)
Target job role (or job link)
👉 System:
Extracts skills from resume
Extracts required skills from job description
Compares both
Outputs:
Missing skills
Match percentage
Learning roadmap
🔑 5. Core Features
5.1 Resume Analyzer
Upload PDF / paste text
Extract:
Skills
Experience
Projects
5.2 Job Description Analyzer
Input:
Job role OR job link
Extract:
Required skills
Experience level
Keywords
5.3 Skill Gap Engine
Compare:
User skills vs required skills
Output:
✅ Matching skills
❌ Missing skills
📊 Match score (%)
5.4 AI Roadmap Generator
Generates:
Weekly learning plan
Resources (courses, docs)
Priority-based skills
5.5 Dashboard
Visual insights:
Progress bar
Skill categories
Improvement suggestions
5.6 Authentication
Login / Signup
Save past analyses
⚙️ 6. Functional Requirements
ID
Requirement
FR1
User can upload resume
FR2
System extracts skills from resume
FR3
User inputs job role/link
FR4
System extracts job skills
FR5
System compares both datasets
FR6
Display match %
FR7
Generate roadmap using AI
FR8
Save results in database
🚫 7. Non-Functional Requirements
⚡ Fast response (<3 sec basic analysis)
🔒 Secure file handling
📱 Responsive UI
☁️ Scalable backend
🧠 Accurate skill extraction
🧩 8. Tech Stack
Frontend
React.js
Tailwind CSS
Backend
Node.js + Express
Database
MongoDB
AI / NLP
OpenAI API / NLP libraries
Resume parsing (PDF parser)
Deployment
Vercel (Frontend)
Render / Railway (Backend)
🏗️ 9. System Architecture
User → Frontend → Backend API → AI/NLP Engine → Database
🔄 10. User Flow
User signs up
Uploads resume
Enters job role
Clicks “Analyze”
Sees:
Match %
Missing skills
Roadmap
📊 11. Success Metrics
✅ User engagement time
📈 Number of analyses per user
🎯 Accuracy of skill matching
🔁 Returning users
⚠️ 12. Risks & Challenges
Resume parsing accuracy
AI hallucination in roadmap
Job description inconsistency
🚀 13. Future Enhancements
🔗 LinkedIn integration
📈 Progress tracking over time
🤖 Auto-apply to jobs
🎥 Interview prep based on gaps
💎 14. Unique Selling Point (USP)
👉 Not just analysis — actionable roadmap with AI👉 Personalized, dynamic, and evolving system
“This product doesn’t just tell users what they lack—it tells them exactly how to fix it step by step.”