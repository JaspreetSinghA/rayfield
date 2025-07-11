import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import os

# Get submission ID from environment
submission_id = os.environ.get('SUBMISSION_ID', None)
if submission_id:
    output_suffix = f'_{submission_id}'
else:
    output_suffix = ''

# Load and clean
TABLES = 'deliverables/tables/'
PLOTS = 'deliverables/plots/'
LOGS = 'deliverables/logs/'

# Ensure directories exist
os.makedirs(TABLES, exist_ok=True)
os.makedirs(PLOTS, exist_ok=True)
os.makedirs(LOGS, exist_ok=True)

# Use submission-specific file path
flagged_file = TABLES + f'flagged_emissions_output{output_suffix}.csv'
if not os.path.exists(flagged_file):
    print(f"Warning: {flagged_file} not found, trying fallback...")
    flagged_file = TABLES + 'flagged_emissions_output.csv'

df = pd.read_csv(flagged_file, encoding='latin1')
df.columns = df.columns.str.strip()
df["year_index"] = df["Reporting Year"] - df["Reporting Year"].min()
min_year = df["Reporting Year"].min()

# Group by year and get average CO2 per year
yearly_avg = df.groupby("year_index")["Unit CO2 emissions (non-biogenic)"].mean().reset_index()

# Train Linear Regression model
X = yearly_avg[["year_index"]]
y = yearly_avg["Unit CO2 emissions (non-biogenic)"]
model = LinearRegression()
model.fit(X, y)
yearly_avg["Predicted"] = model.predict(X)

# Calculate absolute prediction error
yearly_avg["error"] = abs(yearly_avg["Unit CO2 emissions (non-biogenic)"] - yearly_avg["Predicted"])

# Define anomaly threshold: mean + 1.5 std deviation of error
threshold = yearly_avg["error"].mean() + 1.5 * yearly_avg["error"].std()
yearly_avg["anomaly"] = yearly_avg["error"] > threshold

# Filter anomalies
anomalies = yearly_avg[yearly_avg["anomaly"] == True][["year_index", "Unit CO2 emissions (non-biogenic)"]]
anomalies = anomalies.rename(columns={
    "year_index": "index",
    "Unit CO2 emissions (non-biogenic)": "output_kwh"
})

# Convert year_index back to Reporting Year
anomalies["Reporting Year"] = anomalies["index"] + min_year
anomalies["Reporting Year"] = anomalies["Reporting Year"].astype(int)

# Save anomalies to CSV with submission suffix
anomalies.to_csv(TABLES + f'alerts_today{output_suffix}.csv', index=False)

# Generate summary text
def generate_summary(df):
    if df.empty:
        return "✅ No anomalies detected this week."
    summary = f"⚠️ {len(df)} anomaly(s) detected.\n"
    latest = df.sort_values("Reporting Year", ascending=False).iloc[0]
    summary += f"Last anomaly: {latest['Reporting Year']} with {float(latest['output_kwh']):.2f} kWh."
    return summary

summary = generate_summary(anomalies)

# Save summary to text file with submission suffix
with open(LOGS + f'weekly_summary_anomalies{output_suffix}.txt', 'w') as f:
    f.write(summary)

print(f"✅ alerts_today{output_suffix}.csv and weekly_summary_anomalies{output_suffix}.txt created!")

# Plot actual, predicted, and anomalies
plt.figure(figsize=(10, 5))
plt.plot(yearly_avg["year_index"], yearly_avg["Unit CO2 emissions (non-biogenic)"], label="Actual", marker='o')
plt.plot(yearly_avg["year_index"], yearly_avg["Predicted"], label="Predicted", marker='x')
plt.scatter(
    yearly_avg[yearly_avg["anomaly"]]["year_index"],
    yearly_avg[yearly_avg["anomaly"]]["Unit CO2 emissions (non-biogenic)"],
    color='red', label="Anomalies", zorder=5
)
plt.title("AI-Detected Emissions Anomalies")
plt.xlabel("Year Index")
plt.ylabel("Average CO2 Emissions")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(PLOTS + f'yearly_anomaly_detection{output_suffix}.png')
plt.close() 