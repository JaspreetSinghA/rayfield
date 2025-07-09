# Rayfield Emissions Data Pipeline

## Overview
This project implements a data pipeline for energy emissions data, including cleaning, feature engineering, exploratory analysis, machine learning modeling, anomaly detection, and automated summary generation.

## Workflow
1. **Data Loading & Cleaning:**
   - Loads raw emissions data from `emissions_by_unit.csv`.
   - Drops missing values and saves cleaned data to `deliverables/cleaned_emissions_by_unit.csv`.
2. **Feature Engineering:**
   - Adds rolling 7-day average and percent change columns.
   - Saves engineered features to `deliverables/features.csv`.
3. **Model Training & Prediction:**
   - Trains a linear regression model to predict CO₂ emissions.
   - Flags records with >±15% deviation from predicted values.
   - Saves flagged results to `deliverables/flagged_emissions_output.csv`.
   - Trained model is saved as `deliverables/model.pkl`.
4. **Anomaly Detection:**
   - Uses IsolationForest to flag anomalies in emissions data.
   - Results saved to `deliverables/final_output_with_anomalies.csv`.
5. **Visualization:**
   - Generates a line plot of total CO₂ emissions over time (`deliverables/co2_emissions_over_time.png`).
6. **Summary Generation:**
   - Produces a mock AI-generated summary of flagged anomalies.
   - Summary saved to `deliverables/weekly_summary.txt` and attached to final CSV.

## Usage
- Run the main pipeline:
  ```bash
  python backend/main_pipeline.py
  ```
- Outputs will be saved in the `deliverables/` folder.

## Files
- `ai_module.py`: Reusable functions for feature engineering, model training, prediction, and anomaly detection.
- `main_pipeline.py`: Orchestrates the full workflow.
- `deliverables/`: Contains all outputs (cleaned data, features, flagged results, model, plots, summaries).

## Requirements
- Python 3.8+
- pandas, scikit-learn, matplotlib, joblib

Install dependencies:
```bash
pip install pandas scikit-learn matplotlib joblib
```

## Notes
- The pipeline is designed for extensibility and can be adapted for other energy datasets or ML models.
- For real AI summaries, integrate with the OpenAI API in place of the mock summary function. 