# Rayfield Energy Data Analysis Platform - Technical Reference

## Architecture Overview

- **Backend:** Python (FastAPI), runs in `backend/`
  - Handles file uploads, runs analysis pipeline, serves results via REST API
  - Key scripts: `main.py`, `main_pipeline.py`, `ai_module.py`
  - **IMPORTANT:** All backend scripts are now deployment-safe with no top-level file I/O
- **Frontend:** React (TypeScript), in `frontend/client/`
  - User uploads CSV, views analysis results, charts, and summaries
  - Key pages: `UploadSubmission.tsx`, `Review.tsx`, `FlaggedAnomalies.tsx`, `UploadLog.tsx`

## Data Flow: CSV Upload to Analysis Results

1. **User uploads CSV via frontend**
2. **Backend `/api/upload` endpoint**:
   - Saves file as `uploads/<submission_id>_<filename>`
   - Logs upload in DB
   - Runs pipeline scripts with environment variables:
     - `SUBMISSION_ID`, `SUBMISSION_CSV`, `ANOMALY_THRESHOLD`
3. **Pipeline output (per-submission files)**:
   - Tables in `backend/deliverables/tables/`:
     - `final_output_with_anomalies_<submission_id>.csv`
     - `features_<submission_id>.csv`
     - `flagged_emissions_output_<submission_id>.csv`
     - `cleaned_emissions_by_unit_<submission_id>.csv`
   - Plots in `backend/deliverables/plots/`:
     - `co2_emissions_over_time_<submission_id>.png`
     - `co2_emissions_by_industry_<submission_id>.png`
     - `yearly_forecast_vs_actual_<submission_id>.png`
     - `yearly_anomaly_detection_<submission_id>.png`
   - Logs in `backend/deliverables/logs/`:
     - `weekly_summary_<submission_id>.txt`
4. **Frontend fetches results** from `/api/submissions/<submission_id>/results`
   - Backend loads only per-submission files (no fallback to global files)
   - Returns summary, chart data, anomaly list, etc.

## Key File Naming Conventions

### Per-Submission Files (Recommended)
- `final_output_with_anomalies_<submission_id>.csv`: Main analysis output
- `features_<submission_id>.csv`: Feature data for charting
- `flagged_emissions_output_<submission_id>.csv`: Flagged emissions data
- `cleaned_emissions_by_unit_<submission_id>.csv`: Cleaned input data
- `weekly_summary_<submission_id>.txt`: Text summary
- `co2_emissions_over_time_<submission_id>.png`: Time series plot
- `yearly_forecast_vs_actual_<submission_id>.png`: Regression analysis plot

### Global Files (Fallback)
- `flagged_emissions_output.csv`: Legacy global file
- `cleaned_emissions_by_unit.csv`: Legacy global file
- `final_output_with_summary.csv`: Legacy global file

## Recent Fixes & Improvements

### 1. **JSON Serialization Fix** ✅ (Latest)
- Fixed `ValueError: Out of range float values are not JSON compliant: nan` error
- Added proper handling of pandas `nan` values in API responses
- All DataFrame values now converted to JSON-compliant types (None for nan, native Python types)
- Affects: anomaly data, chart data, metrics, and explanations in `/api/submissions/{id}/results`

### 2. **Dashboard Navigation Update** ✅ (Latest)
- Changed "Text Input" tile to "Upload Histories" on main dashboard
- Direct navigation to `/upload-history` for viewing previous uploads and results
- Improved user experience for accessing analysis history

### 3. **Submission-Specific File Paths** ✅
- All pipeline scripts now use `SUBMISSION_ID` environment variable
- Files saved with submission-specific suffixes (e.g., `_123`)
- Fallback logic to global files if submission-specific files don't exist
- Prevents file conflicts between multiple uploads

### 4. **Whitespace Handling** ✅
- All DataFrame column names are stripped of whitespace after loading
- Robust column name detection for CO2 emissions columns
- Prevents KeyError due to trailing spaces in column names

### 5. **Deployment Compatibility** ✅
- All scripts avoid top-level file I/O or data loading
- Processing logic moved inside `main()` functions or `if __name__ == '__main__':` blocks
- Compatible with FastAPI, Vercel, Render, and other deployment platforms

### 6. **Matplotlib Popup Prevention** ✅
- Replaced all `plt.show()` calls with `plt.savefig()` and `plt.close()`
- Plots saved as PNG files in `deliverables/plots/`
- No popup windows during analysis

### 7. **Directory Creation** ✅
- All scripts ensure output directories exist before saving files
- Prevents OSError about non-existent directories

## Pipeline Scripts & Their Functions

### Core Pipeline
- **`main_pipeline.py`**: Complete analysis pipeline (cleaning → features → regression → anomalies)
- **`csvclean.py`**: Data cleaning and initial analysis
- **`ai_module.py`**: Feature engineering and ML model functions

### Analysis Scripts
- **`yearly_regression.py`**: Linear regression on yearly averages
- **`yearly_decision_tree.py`**: Decision tree regression with hyperparameter tuning
- **`yearly_anomaly_alerts.py`**: Anomaly detection and alert generation
- **`full_isolation_forest_anomalies.py`**: Isolation Forest anomaly detection

### Utility Scripts
- **`feature_enrichment.py`**: Advanced feature engineering
- **`force_2025.py`**: Testing utility for Zapier integration
- **`data_analysis.py`**: Exploratory data analysis
- **`emissions_model.py`**: Emissions modeling class
- **`excel_emissions_report.py`**: Excel report generation

## API Endpoints

### File Upload & Processing
- `POST /api/upload`: Upload CSV files and run analysis pipeline
- `GET /api/submissions/{submission_id}/results`: Get analysis results
- `GET /api/submissions/history`: Get upload history

### Reports & Downloads
- `GET /api/reports/list`: List available report files
- `GET /api/reports/download/{rtype}/{filename}`: Download report files
- `GET /api/upload/logs`: Get upload logs

### Static Files
- `GET /static/{path}`: Serve static files (plots, etc.)

## Common Pitfalls & Debugging

### **If results are always the same or show too many records:**
- Check if per-submission files exist in `backend/deliverables/tables/` and `logs/`
- Verify `SUBMISSION_ID` environment variable is set correctly
- Look for fallback to global files in pipeline logs

### **If results page shows error:**
- Check backend logs for pipeline errors (missing columns, crash, etc.)
- Ensure uploaded CSV has required columns: `Unit CO2 emissions (non-biogenic)`, `Reporting Year`
- Verify column names don't have unexpected whitespace
- **JSON Serialization Error**: If you see `ValueError: Out of range float values are not JSON compliant: nan`, this has been fixed in the latest update. The backend now properly handles pandas nan values.

### **If API returns 500 error on results endpoint:**
- Most common cause was JSON serialization of nan values (now fixed)
- Check that per-submission files exist in `backend/deliverables/tables/` and `logs/`
- Verify the submission ID is valid and files were generated successfully

### **If FastAPI or deployment fails to start:**
- All scripts are now import-safe with no top-level file I/O
- Processing logic is inside `main()` or `if __name__ == '__main__':` blocks

### **If plots don't appear:**
- Check `backend/deliverables/plots/` for PNG files
- Verify plot filenames include submission ID
- Use `/api/reports/list` to see available plot files

## Deployment Best Practices (Vercel/Render)

### Backend Requirements
- All scripts are import-safe: no file I/O or data loading at top level
- Only FastAPI app startup code runs on import
- Use environment variables for all dynamic file paths and configuration
- Test locally with `uvicorn main:app --reload` before deploying

### File Organization
- Per-submission files prevent conflicts between multiple users/upload sessions
- Global files serve as fallback for legacy compatibility
- All output directories are created automatically

### Environment Variables
- `SUBMISSION_ID`: Unique identifier for each upload session
- `SUBMISSION_CSV`: Path to uploaded CSV file
- `ANOMALY_THRESHOLD`: Anomaly detection sensitivity (default: "auto")

## How to Extend or Update

### Adding New Analysis
1. Update pipeline logic in `main_pipeline.py` for new features
2. Update frontend result display in `Review.tsx`
3. Ensure new analysis outputs are saved with `<submission_id>` suffix
4. Add new API endpoints in `main.py` if needed

### Frontend Navigation
- **Dashboard**: Central hub with navigation to all features including Upload Histories
- **Upload History**: View all previous uploads and access their analysis results
- **Review Page**: Detailed analysis results for specific submissions
- **Flagged Anomalies**: Comprehensive anomaly monitoring and management

### Adding New Plots
1. Create plot in any pipeline script using `plt.savefig()` and `plt.close()`
2. Save to `backend/deliverables/plots/` with submission suffix
3. Update frontend to display new plots via `/api/reports/list`

### Adding New Data Processing
1. Create new script following the pattern of existing ones
2. Use `SUBMISSION_ID` environment variable for file paths
3. Include fallback logic for missing files
4. Ensure all file I/O is inside `main()` function

## Testing & Validation

### Local Testing
```bash
# Start backend
cd backend
uvicorn main:app --reload

# Start frontend
cd frontend/client
npm run dev
```

### Pipeline Testing
```bash
# Test individual scripts
cd backend
SUBMISSION_ID=test123 SUBMISSION_CSV=path/to/test.csv python main_pipeline.py
```

### File Structure Validation
- Verify per-submission files are created with correct suffixes
- Check that plots are saved as PNG files (not popup windows)
- Ensure all output directories exist and are writable

## Changelog

### Latest Updates (Current)
- **JSON Serialization Fix**: Resolved `ValueError: Out of range float values are not JSON compliant: nan` error in API responses
- **Dashboard Navigation**: Changed "Text Input" tile to "Upload Histories" for better user experience
- **Improved Error Handling**: Better handling of pandas nan values and DataFrame serialization

### Previous Updates
- **Submission-Specific Files**: Implemented per-submission file naming to prevent conflicts
- **Deployment Safety**: Made all scripts import-safe for production deployment
- **Whitespace Handling**: Fixed column name issues with trailing spaces
- **Matplotlib Integration**: Replaced popup windows with file-based plot generation 