from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from datetime import datetime
import pandas as pd
import io
import sqlite3
from pathlib import Path

# Import your existing modules
try:
    from emissions_model import EmissionsModel
    from data_analysis import DataAnalyzer
    from ai_module import AIProcessor
except ImportError:
    # Mock classes for development
    class EmissionsModel:
        def generate_system_report(self):
            return {"status": "mock_data", "emissions": 150.5}
    
    class DataAnalyzer:
        def analyze_data(self, df):
            return {"rows": len(df), "columns": len(df.columns)}
        def generate_analytics_report(self):
            return {"analytics": "mock_data"}
    
    class AIProcessor:
        def process_text(self, text):
            return {"sentiment": "positive", "keywords": ["mock", "data"]}

app = FastAPI(
    title="Rayfield Systems API",
    description="Backend API for Rayfield Systems data analysis and anomaly detection",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# Initialize your existing modules
emissions_model = EmissionsModel()
data_analyzer = DataAnalyzer()
ai_processor = AIProcessor()

# SQLite database setup
DATABASE_URL = "sqlite:///./rayfield.db"

def get_db():
    db_path = Path("rayfield.db")
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite database with tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create anomalies table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS anomalies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            severity TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            submission_type TEXT NOT NULL,
            file_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert default admin user
    cursor.execute('''
        INSERT OR IGNORE INTO users (email, password_hash, name)
        VALUES (?, ?, ?)
    ''', ('admin@rayfield.com', 'hashed_password_here', 'Admin User'))
    
    # Insert sample anomalies
    sample_anomalies = [
        ('Unusual Traffic Pattern', 'High', 'Detected abnormal network traffic from IP 192.168.1.45'),
        ('System Resource Spike', 'Medium', 'CPU usage exceeded 95% for extended period'),
        ('Authentication Failure', 'High', 'Multiple failed login attempts from unknown location'),
        ('Database Query Anomaly', 'Low', 'Slow query detected affecting response times')
    ]
    
    for anomaly in sample_anomalies:
        cursor.execute('''
            INSERT OR IGNORE INTO anomalies (title, severity, description)
            VALUES (?, ?, ?)
        ''', anomaly)
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models for API
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class AnomalyResponse(BaseModel):
    id: int
    title: str
    severity: str
    timestamp: str
    description: str
    status: str

class ReportRequest(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    report_type: str

# Authentication helper
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Implement proper JWT token validation here
    # For now, just return a mock user
    return {"email": "admin@rayfield.com", "name": "Admin User"}

# Health check
@app.get("/")
async def root():
    return {"message": "Rayfield Systems API is running", "status": "healthy"}

# Authentication endpoints
@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (user_data.email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        # In production, verify password hash
        return {
            "access_token": "mock_jwt_token",
            "token_type": "bearer",
            "user": {
                "email": user['email'],
                "name": user['name']
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (email, password_hash, name)
            VALUES (?, ?, ?)
        ''', (user_data.email, "hashed_password", user_data.name))
        conn.commit()
        conn.close()
        return {"message": "User registered successfully"}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already exists")

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

# User endpoints
@app.get("/api/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"],
        "name": current_user["name"],
        "role": "admin"
    }

# Anomaly detection endpoints
@app.get("/api/anomalies")
async def get_anomalies(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM anomalies ORDER BY created_at DESC')
    anomalies = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": row['id'],
            "title": row['title'],
            "severity": row['severity'],
            "timestamp": row['created_at'],
            "description": row['description'],
            "status": row['status']
        }
        for row in anomalies
    ]

@app.get("/api/anomalies/{anomaly_id}")
async def get_anomaly(anomaly_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM anomalies WHERE id = ?', (anomaly_id,))
    anomaly = cursor.fetchone()
    conn.close()
    
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    
    return {
        "id": anomaly['id'],
        "title": anomaly['title'],
        "severity": anomaly['severity'],
        "timestamp": anomaly['created_at'],
        "description": anomaly['description'],
        "status": anomaly['status']
    }

@app.put("/api/anomalies/{anomaly_id}/status")
async def update_anomaly_status(
    anomaly_id: int, 
    status: str, 
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE anomalies SET status = ? WHERE id = ?', (status, anomaly_id))
    conn.commit()
    
    cursor.execute('SELECT * FROM anomalies WHERE id = ?', (anomaly_id,))
    anomaly = cursor.fetchone()
    conn.close()
    
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    
    return {
        "id": anomaly['id'],
        "title": anomaly['title'],
        "severity": anomaly['severity'],
        "timestamp": anomaly['created_at'],
        "description": anomaly['description'],
        "status": anomaly['status']
    }

# File upload endpoints
@app.post("/api/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    current_user: dict = Depends(get_current_user)
):
    try:
        uploaded_files = []
        
        # Save submission to database
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO submissions (title, category, description, submission_type)
            VALUES (?, ?, ?, ?)
        ''', (title, category, description, 'file'))
        
        submission_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        for file in files:
            # Process file with your existing modules
            content = await file.read()
            
            # Save file to disk (in production, use cloud storage)
            file_path = f"uploads/{submission_id}_{file.filename}"
            os.makedirs("uploads", exist_ok=True)
            
            with open(file_path, "wb") as f:
                f.write(content)
            
            # Example: Process CSV files
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.StringIO(content.decode('utf-8')))
                # Use your existing data analysis
                analysis_result = data_analyzer.analyze_data(df)
                uploaded_files.append({
                    "filename": file.filename,
                    "size": len(content),
                    "analysis": analysis_result
                })
            else:
                uploaded_files.append({
                    "filename": file.filename,
                    "size": len(content)
                })
        
        return {
            "message": "Files uploaded successfully",
            "files": uploaded_files,
            "submission_id": submission_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/text")
async def submit_text(
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Save submission to database
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO submissions (title, category, description, submission_type)
            VALUES (?, ?, ?, ?)
        ''', (title, category, content, 'text'))
        
        submission_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Process text with AI module
        ai_result = ai_processor.process_text(content)
        
        return {
            "message": "Text submitted successfully",
            "submission_id": submission_id,
            "ai_analysis": ai_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Report generation endpoints
@app.post("/api/reports/system")
async def generate_system_report(
    request: ReportRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Use your existing emissions model
        report_data = emissions_model.generate_system_report()
        return {
            "report_type": "system",
            "data": report_data,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reports/analytics")
async def generate_analytics_report(
    request: ReportRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Use your existing data analysis
        report_data = data_analyzer.generate_analytics_report()
        return {
            "report_type": "analytics",
            "data": report_data,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reports/compliance")
async def generate_compliance_report(
    request: ReportRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Generate compliance report
        report_data = {
            "compliance_score": 95.5,
            "violations": [],
            "recommendations": ["Implement additional monitoring", "Update security protocols"]
        }
        return {
            "report_type": "compliance",
            "data": report_data,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files for frontend
@app.get("/static/{path:path}")
async def serve_static(path: str):
    return FileResponse(f"static/{path}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 