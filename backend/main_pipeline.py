import os
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from ai_module import add_features, train_regression, predict, tune_regression, train_anomaly_detector, predict_anomalies

# Ensure deliverables folder exists
os.makedirs('deliverables', exist_ok=True)

# Load and clean data
raw = pd.read_csv('emissions_by_unit.csv', encoding='latin1')
df_clean = raw.dropna()
df_clean.to_csv('deliverables/cleaned_emissions_by_unit.csv', index=False)

# Feature engineering
features = add_features(df_clean)
features.to_csv('deliverables/features.csv', index=False)

# Prepare regression
X = features[['Reporting Year', 'rolling_7d', 'pct_change']]
y = features['Unit CO2 emissions (non-biogenic) ']

# Train/test split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model training
model = train_regression(X_train, y_train)
joblib.dump(model, 'deliverables/model.pkl')

# Prediction
features['Predicted CO2'] = predict(model, X)
features['Deviation (%)'] = ((features['Unit CO2 emissions (non-biogenic) '] - features['Predicted CO2']) / features['Predicted CO2']) * 100
features['Flagged'] = features['Deviation (%)'].apply(lambda x: 'Yes' if abs(x) > 15 else 'No')
features.to_csv('deliverables/flagged_emissions_output.csv', index=False)

# Visualization
plt.figure(figsize=(10, 6))
features.groupby('Reporting Year')['Unit CO2 emissions (non-biogenic) '].sum().plot(kind='line', marker='o')
plt.title('Total CO2 Emissions Over Time')
plt.ylabel('CO2 Emissions (metric tons)')
plt.xlabel('Year')
plt.grid(True)
plt.savefig('deliverables/co2_emissions_over_time.png')
plt.close()

# Anomaly detection (optional)
anom_model = train_anomaly_detector(X_train)
features['Anomaly'] = predict_anomalies(anom_model, X)
features.to_csv('deliverables/final_output_with_anomalies.csv', index=False)

# Generate mock summary
flagged = features[features['Flagged'] == 'Yes']
total = len(features)
flagged_count = len(flagged)
summary = f"""
🧾 AI-Generated Compliance Summary:\n\nOut of {total} records, {flagged_count} were flagged for emissions significantly outside the expected baseline (±15%).\n\n"""
if flagged_count >= 2:
    sample = flagged.sample(n=2, random_state=42).reset_index(drop=True)
    for i, row in sample.iterrows():
        summary += f"- Facility {row['Facility Id']} reported {row['Unit CO2 emissions (non-biogenic) ']:.0f} vs predicted {row['Predicted CO2']:.0f} → deviation: {row['Deviation (%)']:.1f}%\n"
summary += "\nThis summary supports audit readiness by highlighting key anomalies."
with open('deliverables/weekly_summary.txt', 'w') as f:
    f.write(summary)

# Attach summary to CSV
features['summary'] = summary
features.to_csv('deliverables/final_output_with_summary.csv', index=False) 