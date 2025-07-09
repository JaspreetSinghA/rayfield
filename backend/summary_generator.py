import pandas as pd

# Load the output file from Task 2.3
df_flagged = pd.read_csv("flagged_emissions_output.csv")

# Filter for flagged records only
flagged = df_flagged[df_flagged['Flagged'] == 'Yes']

# Quick sanity check
print("Number of flagged records:", len(flagged))

# Optional: Preview top records
print(flagged[['Facility Id', 'Reporting Year', 'Unit CO2 emissions (non-biogenic) ',
               'Predicted CO2', 'Deviation (%)']].head(5))

def generate_mock_summary(df):
    flagged = df[df['Flagged'] == 'Yes']
    total = len(df)
    flagged_count = len(flagged)

    # Randomly sample 2 flagged rows
    sample = flagged.sample(n=2, random_state=42).reset_index(drop=True)
    example_1 = sample.iloc[0]
    example_2 = sample.iloc[1]

    summary = f"""
🧾 AI-Generated Compliance Summary:

Out of {total} records, {flagged_count} were flagged for emissions significantly outside the expected baseline (±15%).

Example flagged facilities:
- Facility {example_1['Facility Id']} reported {example_1['Unit CO2 emissions (non-biogenic) ']:.0f} vs predicted {example_1['Predicted CO2']:.0f} → deviation: {example_1['Deviation (%)']:.1f}%
- Facility {example_2['Facility Id']} reported {example_2['Unit CO2 emissions (non-biogenic) ']:.0f} vs predicted {example_2['Predicted CO2']:.0f} → deviation: {example_2['Deviation (%)']:.1f}%

This summary supports audit readiness by highlighting key anomalies.
"""
    return summary

summary = generate_mock_summary(df_flagged)
print(summary)
with open("weekly_summary.txt", "w") as f:
    f.write(summary)

df_flagged['summary'] = summary
df_flagged.to_csv("final_output_with_summary.csv", index=False) 