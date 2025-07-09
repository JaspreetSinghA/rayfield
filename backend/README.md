# Rayfield Emissions Data Pipeline & AI/ML Analysis

## Overview
This project implements a data pipeline for energy emissions data, including cleaning, feature engineering, exploratory analysis, machine learning modeling (regression, decision tree, anomaly detection), and automated summary generation. It is modular, with each major function in its own script.

## Scripts & Their Purposes
- `main_pipeline.py`: Full pipeline from raw data to flagged emissions and summary.
- `feature_enrichment.py`: Adds advanced features (delta_CO2, prediction_error, error_ratio).
- `yearly_regression.py`: Linear regression on yearly averages, forecast vs. actual plot.
- `yearly_decision_tree.py`: Decision tree regression with hyperparameter tuning on yearly averages.
- `yearly_anomaly_alerts.py`: Detects yearly anomalies, exports alerts and summary, and plots.
- `force_2025.py`: Forces last row's year to 2025 for Zapier testing.
- `full_isolation_forest_anomalies.py`: Isolation Forest anomaly detection on a sample of the full dataset, with notes on row limits.

## Outputs
All outputs are saved in `backend/deliverables/` and include:
- Cleaned and enriched CSVs
- Model files
- Plots (PNG)
- Anomaly alerts and logs
- Weekly summaries (text)

## Using GPT Summaries
- To enable real GPT-generated summaries, create a `.env` file in the `backend/` directory with:
  ```
  OPENAI_API_KEY=your_openai_api_key_here
  ```
- The scripts will use this key to call the OpenAI API for summary generation (see below for integration).

## Requirements
- Python 3.8+
- pandas, scikit-learn, matplotlib, joblib, python-dotenv, openai

Install dependencies:
```bash
pip install pandas scikit-learn matplotlib joblib python-dotenv openai
```

## How to Run
- Run any script with:
  ```bash
  python3 backend/<script_name>.py
  ```
- Outputs will appear in `backend/deliverables/`.

## Notes
- Large files are processed with row limits for performance; see notes in output files.
- For real GPT summaries, set your API key in `.env` and use the provided summary functions.
- All scripts are modular and can be run independently. 