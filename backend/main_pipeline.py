import os
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from ai_module import add_features, train_regression, predict, tune_regression, train_anomaly_detector, predict_anomalies, gpt_summary
import numpy as np
from sklearn.preprocessing import StandardScaler

# Output directories
TABLES = 'backend/deliverables/tables/'
PLOTS = 'backend/deliverables/plots/'
LOGS = 'backend/deliverables/logs/'

# Debug: Print environment variables and output paths
submission_id = os.environ.get('SUBMISSION_ID', None)
submission_csv = os.environ.get('SUBMISSION_CSV', None)
anomaly_threshold_env = os.environ.get('ANOMALY_THRESHOLD', None)
print(f"[DEBUG] SUBMISSION_ID: {submission_id}")
print(f"[DEBUG] SUBMISSION_CSV: {submission_csv}")
print(f"[DEBUG] ANOMALY_THRESHOLD: {anomaly_threshold_env}")
if submission_id:
    output_suffix = f'_{submission_id}'
else:
    output_suffix = ''
print(f"[DEBUG] Output files will use suffix: {output_suffix}")
print(f"[DEBUG] Output directory: {TABLES}")

# Ensure deliverables folder exists
os.makedirs('backend/deliverables', exist_ok=True)

# Load and clean data
input_csv = os.environ.get('SUBMISSION_CSV', 'backend/emissions_by_unit.csv')
raw = pd.read_csv(input_csv, encoding='latin1')
print(f"[1/12] Loaded raw data from {input_csv}: shape={raw.shape}")
df_clean = raw.dropna()
print(f"[2/12] Cleaned data: shape={df_clean.shape}")
if df_clean.empty:
    raise ValueError("Cleaned DataFrame is empty after dropna(). Check input file.")
df_clean.to_csv(TABLES + 'cleaned_emissions_by_unit.csv', index=False)
print("[3/12] Saved cleaned data.")

# Feature engineering
features = add_features(df_clean)
print(f"[4/12] Feature engineering complete: shape={features.shape}\n{features.head()}")

# Clean features: replace inf/-inf with NaN, then drop all NaN rows
features.replace([np.inf, -np.inf], np.nan, inplace=True)
features.dropna(inplace=True)
print(f"[5/12] Cleaned features (removed inf/NaN): shape={features.shape}")
if features.empty:
    raise ValueError("Features DataFrame is empty after cleaning. Check feature engineering.")
# Get submission_id from environment for per-submission output
# submission_id = os.environ.get('SUBMISSION_ID', None) # This line is now redundant as it's handled above
# if submission_id: # This line is now redundant as it's handled above
#     output_suffix = f'_{submission_id}' # This line is now redundant as it's handled above
# else: # This line is now redundant as it's handled above
#     output_suffix = '' # This line is now redundant as it's handled above
features.to_csv(TABLES + f'features{output_suffix}.csv', index=False)
print("[6/12] Saved features.")

# Prepare regression
X = features[['Reporting Year', 'rolling_7d', 'pct_change']]
y = features['Unit CO2 emissions (non-biogenic) ']
print(f"[7/12] Prepared regression features: X.shape={X.shape}, y.shape={y.shape}")

# Train/test split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"[8/12] Train/test split: X_train={X_train.shape}, X_test={X_test.shape}")

# Model training
model = train_regression(X_train, y_train)
joblib.dump(model, TABLES + 'model.pkl')
print("[9/12] Trained regression model and saved model.pkl.")

# Prediction
features['Predicted CO2'] = predict(model, X)
features['Deviation (%)'] = ((features['Unit CO2 emissions (non-biogenic) '] - features['Predicted CO2']) / features['Predicted CO2']) * 100
features['Flagged'] = features['Deviation (%)'].apply(lambda x: 'Yes' if abs(x) > 15 else 'No')
features.to_csv(TABLES + f'flagged_emissions_output{output_suffix}.csv', index=False)
print("[10/12] Saved flagged emissions output.")

# Read anomaly threshold from environment variable
# anomaly_threshold_env = os.environ.get('ANOMALY_THRESHOLD', 'auto') # This line is now redundant as it's handled above
if anomaly_threshold_env == 'auto' or anomaly_threshold_env == '':
    anomaly_threshold = 'auto'
else:
    try:
        val = float(anomaly_threshold_env)
        if val > 0 and val < 1:
            anomaly_threshold = val
        elif val > 0 and val < 100:
            anomaly_threshold = val / 100.0
        else:
            anomaly_threshold = 'auto'
    except Exception:
        anomaly_threshold = 'auto'
print(f"[Anomaly Detection] Using contamination: {anomaly_threshold}")

# Improved Anomaly detection with scaling and more features
anomaly_features = features[['Unit CO2 emissions (non-biogenic) ', 'rolling_7d', 'pct_change']]
scaler = StandardScaler()
anomaly_features_scaled = scaler.fit_transform(anomaly_features)
from ai_module import train_anomaly_detector, predict_anomalies
if anomaly_threshold == 'auto':
    anom_model = train_anomaly_detector(anomaly_features_scaled, contamination='auto')
else:
    anom_model = train_anomaly_detector(anomaly_features_scaled, contamination=anomaly_threshold)
features['Anomaly'] = predict_anomalies(anom_model, anomaly_features_scaled)
features.to_csv(TABLES + f'final_output_with_anomalies{output_suffix}.csv', index=False)

# Visualization
plt.figure(figsize=(10, 6))
features.groupby('Reporting Year')['Unit CO2 emissions (non-biogenic) '].sum().plot(kind='line', marker='o')
plt.title('Total CO2 Emissions Over Time')
plt.ylabel('CO2 Emissions (metric tons)')
plt.xlabel('Year')
plt.grid(True)
plt.savefig(PLOTS + 'co2_emissions_over_time.png')
plt.close()
print("[11/12] Saved CO2 emissions over time plot.")

# Generate mock summary
flagged = features[features['Flagged'] == 'Yes']
total = len(features)
flagged_count = len(flagged)
# Generate summary using GPT or mock
summary_prompt = f"Generate a compliance summary for {flagged_count} flagged out of {total} records. Give 2 example facilities with their actual, predicted, and deviation."  # You can customize this prompt
summary = gpt_summary(summary_prompt)
with open(LOGS + 'weekly_summary.txt', 'w') as f:
    f.write(summary)
# Attach summary to CSV
features['summary'] = summary
features.to_csv(TABLES + f'final_output_with_summary{output_suffix}.csv', index=False)
print("Pipeline complete. All outputs saved in backend/deliverables/.")
