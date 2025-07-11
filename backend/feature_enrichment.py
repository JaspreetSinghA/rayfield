import pandas as pd
import os

# Get submission ID from environment
submission_id = os.environ.get('SUBMISSION_ID', None)
if submission_id:
    output_suffix = f'_{submission_id}'
else:
    output_suffix = ''

# Load with correct encoding
# Use flagged_emissions_output.csv as input
TABLES = 'deliverables/tables/'

# Ensure directory exists
os.makedirs(TABLES, exist_ok=True)

# Use submission-specific file path
flagged_file = TABLES + f'flagged_emissions_output{output_suffix}.csv'
if not os.path.exists(flagged_file):
    print(f"Warning: {flagged_file} not found, trying fallback...")
    flagged_file = TABLES + 'flagged_emissions_output.csv'

df = pd.read_csv(flagged_file, encoding='latin1')
df.columns = df.columns.str.strip()  # Strip all column names to avoid trailing space issues

# 7-day rolling average of CO2 emissions (already in main pipeline, but safe to recalc)
df["rolling_7d_CO2"] = df["Unit CO2 emissions (non-biogenic)"].rolling(7).mean()

# Day-to-day change in CO2 emissions
df["delta_CO2"] = df["Unit CO2 emissions (non-biogenic)"].diff()

# Absolute prediction error
df["prediction_error"] = df["Predicted CO2"] - df["Unit CO2 emissions (non-biogenic)"]

# Prediction error as a ratio (add 1 to avoid divide-by-zero)
df["error_ratio"] = df["prediction_error"] / (df["Unit CO2 emissions (non-biogenic)"] + 1)

# Save cleaned and enriched dataset with submission suffix
df.to_csv(TABLES + f'cleaned_flagged_emissions{output_suffix}.csv', index=False)
print(f"[feature_enrichment] Saved cleaned_flagged_emissions{output_suffix}.csv with new features.") 