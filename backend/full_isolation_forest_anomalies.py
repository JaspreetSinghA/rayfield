import pandas as pd
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt

# Parameters
ROW_LIMIT = 10000  # Limit for processing large files

# Load data with limit
TABLES = 'backend/deliverables/tables/'
PLOTS = 'backend/deliverables/plots/'
LOGS = 'backend/deliverables/logs/'
chunks = pd.read_csv(TABLES + 'final_output_with_summary.csv', chunksize=ROW_LIMIT)
df = next(chunks)
df.columns = df.columns.str.strip()

note = f"NOTE: Only the first {ROW_LIMIT} rows were processed for anomaly detection due to performance limits.\n"

# Drop rows with missing CO2 emission values
df = df.dropna(subset=["Unit CO2 emissions (non-biogenic)"])

# Run IsolationForest on CO2 emissions
model = IsolationForest(contamination=0.05, random_state=42)
df["anomaly"] = model.fit_predict(df[["Unit CO2 emissions (non-biogenic)"]]) == -1

# Save anomalies with note
anomalies = df[df["anomaly"] == True]
with open(TABLES + 'full_isolation_forest_anomalies.csv', 'w') as f:
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
plt.savefig(PLOTS + 'full_isolation_forest_anomalies_plot.png')
plt.show()

# Print basic alert log for anomalies
with open(LOGS + 'full_isolation_forest_anomalies_log.txt', 'w') as f:
    f.write(note)
    for i, row in anomalies.iterrows():
        f.write(f"Anomaly detected — Facility: {row['Facility Name']} | Year: {row['Reporting Year']} | CO2: {row['Unit CO2 emissions (non-biogenic)']}\n")

print(f"[full_isolation_forest_anomalies] Processed {ROW_LIMIT} rows. Anomalies and log saved with note.") 