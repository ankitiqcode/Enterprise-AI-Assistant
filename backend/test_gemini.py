from app.ai.resume_analyzer import analyze_resume

resume = """
Ankit Verma

Python Developer

Skills:
Python
SQL
FastAPI
Power BI

Experience:
Built HRMS backend using FastAPI.

Education:
B.Tech CSE
"""

result = analyze_resume(resume)

print(result)