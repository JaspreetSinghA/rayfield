import pandas as pd

# Load with correct encoding
# Use flagged_emissions_output.csv as input

TABLES = 'backend/deliverables/tables/'
df = pd.read_csv(TABLES + 'flagged_emissions_output.csv', encoding='latin1')
df.columns = df.columns.str.strip()  # Strip all column names to avoid trailing space issues

# 7-day rolling average of CO2 emissions (already in main pipeline, but safe to recalc)
df["rolling_7d_CO2"] = df["Unit CO2 emissions (non-biogenic)"].rolling(7).mean()

# Day-to-day change in CO2 emissions
df["delta_CO2"] = df["Unit CO2 emissions (non-biogenic)"].diff()

# Absolute prediction error
df["prediction_error"] = df["Predicted CO2"] - df["Unit CO2 emissions (non-biogenic)"]

# Prediction error as a ratio (add 1 to avoid divide-by-zero)
df["error_ratio"] = df["prediction_error"] / (df["Unit CO2 emissions (non-biogenic)"] + 1)

# Save cleaned and enriched dataset
df.to_csv(TABLES + 'cleaned_flagged_emissions.csv', index=False)
print("[feature_enrichment] Saved cleaned_flagged_emissions.csv with new features.") 