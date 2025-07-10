import os
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from ai_module import add_features, train_regression, predict, tune_regression, train_anomaly_detector, predict_anomalies, gpt_summary
import numpy as np
from sklearn.preprocessing import StandardScaler

# Ensure deliverables folder exists
os.makedirs('backend/deliverables', exist_ok=True)

# Load and clean data
raw = pd.read_csv('backend/emissions_by_unit.csv', encoding='latin1')
print(f"[1/12] Loaded raw data: shape={raw.shape}")
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
features.to_csv(TABLES + 'features.csv', index=False)
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
features.to_csv(TABLES + 'flagged_emissions_output.csv', index=False)
print("[10/12] Saved flagged emissions output.")

# Improved Anomaly detection with scaling and more features
anomaly_features = features[['Unit CO2 emissions (non-biogenic) ', 'rolling_7d', 'pct_change']]
scaler = StandardScaler()
anomaly_features_scaled = scaler.fit_transform(anomaly_features)
from ai_module import train_anomaly_detector, predict_anomalies
anom_model = train_anomaly_detector(anomaly_features_scaled)
features['Anomaly'] = predict_anomalies(anom_model, anomaly_features_scaled)
features.to_csv(TABLES + 'final_output_with_anomalies.csv', index=False)

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
features.to_csv(TABLES + 'final_output_with_summary.csv', index=False)
print("Pipeline complete. All outputs saved in backend/deliverables/.")
