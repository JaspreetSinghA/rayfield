import pandas as pd
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt
import os

# Get submission ID from environment
submission_id = os.environ.get('SUBMISSION_ID', None)
if submission_id:
    output_suffix = f'_{submission_id}'
else:
    output_suffix = ''

# Parameters
ROW_LIMIT = 10000  # Limit for processing large files

# Load data with limit
TABLES = 'deliverables/tables/'
PLOTS = 'deliverables/plots/'
LOGS = 'deliverables/logs/'

# Ensure directories exist
os.makedirs(TABLES, exist_ok=True)
os.makedirs(PLOTS, exist_ok=True)
os.makedirs(LOGS, exist_ok=True)

# Use submission-specific file path
summary_file = TABLES + f'final_output_with_summary{output_suffix}.csv'
if not os.path.exists(summary_file):
    print(f"Warning: {summary_file} not found, trying fallback...")
    summary_file = TABLES + 'final_output_with_summary.csv'

chunks = pd.read_csv(summary_file, chunksize=ROW_LIMIT)
df = next(chunks)
df.columns = df.columns.str.strip()

note = f"NOTE: Only the first {ROW_LIMIT} rows were processed for anomaly detection due to performance limits.\n"

# Drop rows with missing CO2 emission values
df = df.dropna(subset=["Unit CO2 emissions (non-biogenic)"])

# Run IsolationForest on CO2 emissions
model = IsolationForest(contamination=0.05, random_state=42)
df["anomaly"] = model.fit_predict(df[["Unit CO2 emissions (non-biogenic)"]]) == -1

# Save anomalies with note and submission suffix
anomalies = df[df["anomaly"] == True]
with open(TABLES + f'full_isolation_forest_anomalies{output_suffix}.csv', 'w') as f:
    f.write(note)
    anomalies.to_csv(f, index=False)

# Plot energy (CO2) output with anomalies
plt.figure(figsize=(12, 6))
plt.plot(df["Reporting Year"], df["Unit CO2 emissions (non-biogenic)"], label="CO2 Emissions", color="blue", marker='o')
plt.scatter(anomalies["Reporting Year"], anomalies["Unit CO2 emissions (non-biogenic)"], color="red", label="Anomalies", zorder=5)
plt.xlabel("Reporting Year")
plt.ylabel("CO2 Emissions (non-biogenic)")
plt.title("CO2 Emissions with Anomalies Highlighted (Sampled)")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(PLOTS + f'full_isolation_forest_anomalies_plot{output_suffix}.png')
plt.close()

# Print basic alert log for anomalies with submission suffix
with open(LOGS + f'full_isolation_forest_anomalies_log{output_suffix}.txt', 'w') as f:
    f.write(note)
    for i, row in anomalies.iterrows():
        f.write(f"Anomaly detected — Facility: {row['Facility Name']} | Year: {row['Reporting Year']} | CO2: {row['Unit CO2 emissions (non-biogenic)']}\n")

print(f"[full_isolation_forest_anomalies] Processed {ROW_LIMIT} rows. Anomalies and log saved with note.") 