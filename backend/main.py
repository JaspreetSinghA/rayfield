from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Path, Body
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
from pathlib import Path as FilePath
import time

# Import your existing modules
try:
    from emissions_model import EmissionsModel
    from data_analysis import DataAnalyzer
    from ai_module import AIProcessor
    from summary_generator import EnergySummaryGenerator
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
    
    class EnergySummaryGenerator:
        def generate_summary(self, results):
            return f"Analysis completed for {results.get('total_records', 0)} records. Found {results.get('anomalies_found', 0)} anomalies."

app = FastAPI(
    title="Rayfield Systems API",
    description="Backend API for Rayfield Systems data analysis and anomaly detection",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Set to frontend dev origin for local dev
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
summary_generator = EnergySummaryGenerator()

# SQLite database setup
DATABASE_URL = "sqlite:///./rayfield.db"

def get_db():
    db_path = FilePath("rayfield.db")
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
    
    # Create upload_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS upload_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_id INTEGER,
            csv_filename TEXT,
            anomaly_threshold TEXT,
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

class EnergyDataProcessRequest(BaseModel):
    submission_id: str
    files: List[str]

class EnergyDataResponse(BaseModel):
    submission_id: str
    anomalies_found: int
    total_records: int
    processing_time: float
    anomalies_data: List[dict]
    summary: str
    chart_data: dict

# Authentication helper
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Implement proper JWT token validation here
    # For now, just return a mock user
    return {"email": "admin@rayfield.com", "name": "Admin User"}

# Health check
@app.get("/")
async def root():
    return {"message": "Rayfield Systems API is running", "status": "healthy"}

# Test endpoint without authentication
@app.post("/api/upload/test")
async def upload_files_test(
    files: List[UploadFile] = File(...),
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form("")
):
    """Test endpoint without authentication for debugging"""
    try:
        uploaded_files = []
        
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
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
            try:
                # Process file with your existing modules
                content = await file.read()
                
                # Save file to disk (in production, use cloud storage)
                file_path = f"uploads/{submission_id}_{file.filename}"
                
                with open(file_path, "wb") as f:
                    f.write(content)
                
                # Example: Process CSV files
                if file.filename.endswith('.csv'):
                    try:
                        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
                        df.columns = df.columns.str.strip()
                        # Use your existing data analysis
                        analysis_result = data_analyzer.analyze_data(df)
                        uploaded_files.append({
                            "filename": file.filename,
                            "size": len(content),
                            "analysis": analysis_result,
                            "file_path": file_path
                        })
                    except Exception as csv_error:
                        print(f"CSV processing error: {csv_error}")
                        uploaded_files.append({
                            "filename": file.filename,
                            "size": len(content),
                            "analysis": {"error": "CSV processing failed"},
                            "file_path": file_path
                        })
                else:
                    uploaded_files.append({
                        "filename": file.filename,
                        "size": len(content),
                        "file_path": file_path
                    })
            except Exception as file_error:
                print(f"File processing error: {file_error}")
                uploaded_files.append({
                    "filename": file.filename,
                    "size": 0,
                    "error": str(file_error)
                })
        
        return {
            "message": "Files uploaded successfully",
            "files": uploaded_files,
            "submission_id": submission_id
        }
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
    anomaly_threshold: str = Form("auto"),
    current_user: dict = Depends(get_current_user)
):
    try:
        uploaded_files = []
        results = []
        os.makedirs("uploads", exist_ok=True)
        for file in files:
            if not file.filename.endswith('.csv'):
                continue  # Only process CSVs
            content = await file.read()
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
            file_path = f"uploads/{submission_id}_{file.filename}"
            with open(file_path, "wb") as f:
                f.write(content)
            # Validate CSV columns
            try:
                df = pd.read_csv(file_path, encoding='latin1')
                df.columns = df.columns.str.strip()
                required_columns = [
                    'Unit CO2 emissions (non-biogenic)',
                    'Reporting Year'
                ]
                missing_cols = [col for col in required_columns if col not in df.columns]
                if missing_cols:
                    uploaded_files.append({
                        "filename": file.filename,
                        "size": len(content),
                        "error": f"Missing columns: {', '.join(missing_cols)}",
                        "submission_id": submission_id
                    })
                    continue
            except Exception as e:
                uploaded_files.append({
                    "filename": file.filename,
                    "size": len(content),
                    "error": str(e),
                    "submission_id": submission_id
                })
                continue
            # Log upload
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO upload_logs (submission_id, csv_filename, anomaly_threshold)
                VALUES (?, ?, ?)
            ''', (submission_id, file.filename, anomaly_threshold))
            conn.commit()
            conn.close()
            # Run pipeline
            import subprocess
            import sys
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            pipeline_scripts = [
                "csvclean.py",
                "main_pipeline.py",
                "yearly_regression.py",
                "yearly_anomaly_alerts.py",
                "excel_emissions_report.py"
            ]
            pipeline_logs = []
            env = os.environ.copy()
            env["ANOMALY_THRESHOLD"] = anomaly_threshold
            env["SUBMISSION_ID"] = str(submission_id)
            env["SUBMISSION_CSV"] = os.path.abspath(file_path)
            for script in pipeline_scripts:
                script_path = os.path.join(backend_dir, script)
                try:
                    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True, check=True, env=env)
                    pipeline_logs.append({"script": script, "stdout": result.stdout, "stderr": result.stderr, "status": "success"})
                except subprocess.CalledProcessError as e:
                    pipeline_logs.append({"script": script, "stdout": e.stdout, "stderr": e.stderr, "status": "error"})
                    uploaded_files.append({
                        "filename": file.filename,
                        "size": len(content),
                        "error": f"Pipeline failed at {script}: {e.stderr}",
                        "submission_id": submission_id
                    })
                    break
            uploaded_files.append({
                "filename": file.filename,
                "size": len(content),
                "file_path": file_path,
                "submission_id": submission_id,
                "pipeline_logs": pipeline_logs
            })
            results.append({
                "submission_id": submission_id,
                "filename": file.filename
            })
        return {
            "message": "Files uploaded and processed.",
            "files": uploaded_files,
            "results": results
        }
    except Exception as e:
        print(f"Upload error: {e}")
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

@app.post("/api/process-energy-data")
async def process_energy_data(
    request: EnergyDataProcessRequest,
    current_user: dict = Depends(get_current_user)
):
    return JSONResponse(status_code=400, content={
        "message": "This endpoint is deprecated. Results are available after upload."
    })

# In-memory storage for thresholds and feedback (for demo; replace with DB in production)
THRESHOLDS = {}
ANOMALY_FEEDBACK = {}

@app.get("/api/thresholds/{submission_id}")
async def get_thresholds(submission_id: str, current_user: dict = Depends(get_current_user)):
    return THRESHOLDS.get(submission_id, {"anomaly": "auto", "flagged": 15})

@app.post("/api/thresholds/{submission_id}")
async def set_thresholds(submission_id: str, thresholds: dict = Body(...), current_user: dict = Depends(get_current_user)):
    THRESHOLDS[submission_id] = thresholds
    return {"status": "ok", "thresholds": thresholds}

@app.post("/api/anomaly-feedback/{submission_id}/{anomaly_id}")
async def submit_anomaly_feedback(submission_id: str, anomaly_id: int, feedback: dict = Body(...), current_user: dict = Depends(get_current_user)):
    key = f"{submission_id}:{anomaly_id}"
    ANOMALY_FEEDBACK[key] = feedback
    return {"status": "ok", "feedback": feedback}

@app.get("/api/anomaly-feedback/{submission_id}/{anomaly_id}")
async def get_anomaly_feedback(submission_id: str, anomaly_id: int, current_user: dict = Depends(get_current_user)):
    key = f"{submission_id}:{anomaly_id}"
    return ANOMALY_FEEDBACK.get(key, {})

@app.get("/api/submissions/{submission_id}/results")
async def get_submission_results(
    submission_id: str,
    current_user: dict = Depends(get_current_user)
):
    import os
    import pandas as pd
    import time
    # Check both possible locations for the files
    results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deliverables', 'tables')
    summary_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deliverables', 'logs')
    # Also check the nested backend/deliverables location
    results_dir_nested = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'deliverables', 'tables')
    summary_dir_nested = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'deliverables', 'logs')
    # Try primary location first, then nested location
    anomalies_path = os.path.join(results_dir, f'final_output_with_anomalies_{submission_id}.csv')
    summary_path = os.path.join(summary_dir, f'weekly_summary_{submission_id}.txt')
    chart_path = os.path.join(results_dir, f'features_{submission_id}.csv')
    
    # If not found in primary location, try nested location
    if not os.path.exists(anomalies_path):
        anomalies_path = os.path.join(results_dir_nested, f'final_output_with_anomalies_{submission_id}.csv')
    if not os.path.exists(summary_path):
        summary_path = os.path.join(summary_dir_nested, f'weekly_summary_{submission_id}.txt')
    if not os.path.exists(chart_path):
        chart_path = os.path.join(results_dir_nested, f'features_{submission_id}.csv')
    
    # Check for per-submission files only; do not fallback to global
    missing = []
    if not os.path.exists(anomalies_path):
        print(f"[ERROR] Per-submission anomalies file not found: {anomalies_path}")
        missing.append('anomalies')
    if not os.path.exists(summary_path):
        print(f"[ERROR] Per-submission summary file not found: {summary_path}")
        missing.append('summary')
    if not os.path.exists(chart_path):
        print(f"[ERROR] Per-submission chart file not found: {chart_path}")
        missing.append('chart')
    if missing:
        return JSONResponse(status_code=404, content={
            "message": f"Analysis results not available for submission {submission_id}. Missing: {', '.join(missing)}. Please check your upload or contact support.",
            "missing": missing
        })
    start_time = time.time()
    try:
        anomalies_data = []
        total_records = 0
        anomalies_found = 0
        df = pd.read_csv(anomalies_path)
        df.columns = df.columns.str.strip()
        print(f"[DEBUG] Loaded anomalies file: {anomalies_path}, shape={df.shape}")
        total_records = int(len(df))
        if 'Anomaly' in df.columns:
            anomalies_found = int((df['Anomaly'] == True).sum())
        else:
            print(f"[DEBUG] 'Anomaly' column not found in {anomalies_path}")
        max_anomalies = 100
        anomaly_rows = [row for idx, row in df.iterrows() if row.get('Anomaly', False) == True]
        for idx, row in enumerate(anomaly_rows[:max_anomalies]):
            facility = row.get("Facility Name", "Unknown")
            year = row.get("Reporting Year", "Unknown")
            try:
                year = int(year)
            except Exception:
                year = str(year)
            # Handle column name with or without trailing space
            co2_col = None
            for col in row.index:
                if col.strip() == "Unit CO2 emissions (non-biogenic)":
                    co2_col = col
                    break
            emission_value = row.get(co2_col, 0) if co2_col else 0
            try:
                emission_value = float(emission_value)
            except Exception:
                emission_value = 0.0
            deviation = None
            try:
                deviation = float(row.get("Deviation (%)", row.get("Deviation (%) ", 0)))
            except Exception:
                deviation = None
            if deviation is not None:
                if abs(deviation) >= 30:
                    severity = "High"
                elif abs(deviation) >= 15:
                    severity = "Medium"
                else:
                    severity = "Low"
            else:
                severity = "High"
            anomaly_dict = {
                "id": int(idx),
                "facility": str(facility),
                "year": year,
                "emission_value": emission_value,
                "severity": severity,
                "timestamp": f"{year}-01-01T00:00:00Z"
            }
            for k, v in row.items():
                if k not in anomaly_dict:
                    # Handle nan values for JSON serialization
                    if pd.isna(v):
                        anomaly_dict[k] = None
                    elif isinstance(v, (int, float)):
                        # Convert to native Python types to avoid numpy/pandas serialization issues
                        anomaly_dict[k] = float(v) if isinstance(v, float) else int(v)
                    else:
                        anomaly_dict[k] = str(v) if v is not None else None
            anomalies_data.append(anomaly_dict)
        summary = None
        with open(summary_path, 'r') as f:
            summary = f.read()
        chart_data = None
        chart_df = pd.read_csv(chart_path)
        chart_df.columns = chart_df.columns.str.strip()
        labels_raw = chart_df["Reporting Year"].tolist()[:100]
        # Handle nan values in labels list
        labels = []
        for val in labels_raw:
            if pd.isna(val):
                labels.append(None)
            elif isinstance(val, (int, float)):
                labels.append(int(val) if isinstance(val, float) and val.is_integer() else val)
            else:
                labels.append(str(val) if val is not None else None)
        # Handle column name with or without trailing space
        co2_col = None
        for col in chart_df.columns:
            if col.strip() == "Unit CO2 emissions (non-biogenic)":
                co2_col = col
                break
        emissions_raw = chart_df[co2_col].tolist()[:100] if co2_col else []
        # Handle nan values in emissions list
        emissions = []
        for val in emissions_raw:
            if pd.isna(val):
                emissions.append(None)
            elif isinstance(val, (int, float)):
                emissions.append(float(val) if isinstance(val, float) else int(val))
            else:
                emissions.append(str(val) if val is not None else None)
        anomaly_years = set(a["year"] for a in anomalies_data)
        anomaly_indices = [i for i, y in enumerate(labels) if y in anomaly_years]
        chart_data = {
            "labels": labels,
            "emissions": emissions,
            "anomaly_indices": anomaly_indices
        }
        processing_time = time.time() - start_time
        metrics = None
        anomaly_warning = ''
        if 'R2' in df.columns and 'RMSE' in df.columns:
            r2_val = df['R2'].iloc[0]
            rmse_val = df['RMSE'].iloc[0]
            # Handle nan values in metrics
            metrics = {
                "r2": float(r2_val) if not pd.isna(r2_val) else None,
                "rmse": float(rmse_val) if not pd.isna(rmse_val) else None
            }
        if 'Anomaly Explanation' in df.columns:
            for a in anomalies_data:
                idx = a.get('id', None)
                if idx is not None and idx < len(df):
                    explanation = df.iloc[idx].get('Anomaly Explanation', '')
                    # Handle nan values in explanation
                    if pd.isna(explanation):
                        a['explanation'] = ''
                    else:
                        a['explanation'] = str(explanation)
        anomaly_count = int((df['Anomaly'] == True).sum()) if 'Anomaly' in df.columns else 0
        if anomaly_count == 0:
            anomaly_warning = 'No anomalies detected. Consider lowering the threshold.'
        elif anomaly_count == len(df):
            anomaly_warning = 'All points flagged as anomalies. Consider raising the threshold.'
        return {
            "submission_id": str(submission_id),
            "anomalies_found": int(anomalies_found),
            "total_records": int(total_records),
            "processing_time": float(processing_time),
            "anomalies_data": anomalies_data,
            "summary": summary,
            "chart_data": chart_data,
            "metrics": metrics,
            "anomaly_warning": anomaly_warning
        }
    except Exception as e:
        print(f"[DEBUG] Exception in get_submission_results: {e}")
        return JSONResponse(status_code=500, content={
            "message": "Failed to load results.",
            "error": str(e)
        })

@app.get("/api/submissions/history")
async def get_submission_history(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, title, category, description, created_at, file_path FROM submissions ORDER BY created_at DESC')
    submissions = cursor.fetchall()
    conn.close()
    history = []
    for row in submissions:
        history.append({
            "id": row[0],
            "title": row[1],
            "category": row[2],
            "description": row[3],
            "created_at": row[4],
            "file_path": row[5],
        })
    return history

@app.get("/api/upload/logs")
async def get_upload_logs(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT submission_id, csv_filename, anomaly_threshold, created_at FROM upload_logs ORDER BY created_at DESC')
    logs = cursor.fetchall()
    conn.close()
    return [
        {
            "submission_id": row[0],
            "csv_filename": row[1],
            "anomaly_threshold": row[2],
            "created_at": row[3],
        }
        for row in logs
    ]

# Serve static files for frontend
@app.get("/static/{path:path}")
async def serve_static(path: str):
    return FileResponse(f"static/{path}")

@app.get("/api/reports/list")
async def list_reports(current_user: dict = Depends(get_current_user)):
    """
    List available report files from deliverables/tables, deliverables/logs, and deliverables/plots.
    Returns metadata: name, type, size, modified date, and download path.
    """
    base_dirs = {
        "tables": os.path.join(os.path.dirname(os.path.abspath(__file__)), "deliverables", "tables"),
        "logs": os.path.join(os.path.dirname(os.path.abspath(__file__)), "deliverables", "logs"),
        "plots": os.path.join(os.path.dirname(os.path.abspath(__file__)), "deliverables", "plots"),
    }
    report_files = []
    for rtype, dir_path in base_dirs.items():
        if not os.path.exists(dir_path):
            continue
        for fname in os.listdir(dir_path):
            if fname.startswith("."):
                continue
            fpath = os.path.join(dir_path, fname)
            if not os.path.isfile(fpath):
                continue
            stat = os.stat(fpath)
            report_files.append({
                "name": fname,
                "type": rtype,
                "size": stat.st_size,
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "download_url": f"/api/reports/download/{rtype}/{fname}"
            })
    return report_files

@app.get("/api/reports/download/{rtype}/{filename:path}")
async def download_report(
    rtype: str = Path(..., pattern="^(tables|logs|plots)$"),
    filename: str = Path(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Download a report file from deliverables/tables, deliverables/logs, or deliverables/plots.
    """
    base_dirs = {
        "tables": os.path.join(os.path.dirname(os.path.abspath(__file__)), "deliverables", "tables"),
        "logs": os.path.join(os.path.dirname(os.path.abspath(__file__)), "deliverables", "logs"),
        "plots": os.path.join(os.path.dirname(os.path.abspath(__file__)), "deliverables", "plots"),
    }
    if rtype not in base_dirs:
        raise HTTPException(status_code=400, detail="Invalid report type")
    dir_path = base_dirs[rtype]
    file_path = os.path.join(dir_path, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 