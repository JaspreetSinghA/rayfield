import pandas as pd
import numpy as np
import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from ai_module import gpt_summary

# Constants
INPUT_CSV = 'backend/emissions_by_unit.csv'
OUTPUT_XLSX = 'backend/deliverables/tables/emissions_report.xlsx'
SUMMARY_TXT = 'backend/deliverables/logs/emissions_report_summary.txt'
ZAPIER_WEBHOOK = 'https://zapier.com/editor/308521987/draft/308521987/setup'

os.makedirs('backend/deliverables/tables/', exist_ok=True)
os.makedirs('backend/deliverables/logs/', exist_ok=True)

# Load data
print(f"Loading data from {INPUT_CSV}")
df = pd.read_csv(INPUT_CSV, encoding='latin1')
df.columns = df.columns.str.strip()

# Try to find CO2, CH4, Date columns
possible_co2_cols = [
    c for c in df.columns if (
        ('CO2' in c and 'tons' in c) or ('CO2' in c and 'emissions' in c) or ('CO2' in c and 'metric' in c)
    )
]
possible_ch4_cols = [
    c for c in df.columns if (
        ('CH4' in c and 'emissions' in c) or ('Methane' in c)
    )
]
possible_date_cols = [
    c for c in df.columns if (
        'Date' in c or 'date' in c)
]
possible_year_cols = [
    c for c in df.columns if 'Year' in c or 'year' in c]

co2_col = possible_co2_cols[0] if possible_co2_cols else None
ch4_col = possible_ch4_cols[0] if possible_ch4_cols else None
date_col = possible_date_cols[0] if possible_date_cols else None
year_col = possible_year_cols[0] if possible_year_cols else None

if not co2_col or not ch4_col:
    print('Available columns:', df.columns.tolist())
    raise ValueError(f"Missing required columns. Found: CO2={co2_col}, CH4={ch4_col}, Date={date_col}, Year={year_col}")

# If no date column, but year is present, create a pseudo-date
if not date_col and year_col:
    print(f"No date column found, using year column '{year_col}' to create pseudo-dates.")
    df['Date'] = pd.to_datetime(df[year_col].astype(str) + '-01-01')
    date_col = 'Date'
elif date_col:
    print("Converting Date column to datetime...")
    df['Date'] = pd.to_datetime(df[date_col])
else:
    print('Available columns:', df.columns.tolist())
    raise ValueError(f"Missing both Date and Year columns. Found: Date={date_col}, Year={year_col}")

# Calculate CO2e
print("Calculating CO2e (tons)...")
df['CO2e (tons)'] = df[co2_col] * 1 + df[ch4_col] * 25

# Create 'Quarter' column
df['Quarter'] = df['Date'].dt.to_period('Q').astype(str)

# Summaries
facility_col = next((c for c in df.columns if 'Facility' in c), None)
# Grouping columns for additional summaries
extra_groupings = [
    ('Unit Type', 'By Unit Type'),
    ('Unit Name', 'By Unit Name'),
    ('Industry Type (sectors)', 'By Industry Sector'),
    ('Industry Type (subparts)', 'By Industry Subpart'),
]

# Build all summaries
summaries = {}
if facility_col:
    summaries['By Facility'] = df.groupby(facility_col)[[co2_col, ch4_col, 'CO2e (tons)']].sum().reset_index()
summaries['By Quarter'] = df.groupby('Quarter')[[co2_col, ch4_col, 'CO2e (tons)']].sum().reset_index()

for col, sheet_name in extra_groupings:
    if col in df.columns:
        summaries[sheet_name] = df.groupby(col)[[co2_col, ch4_col, 'CO2e (tons)']].sum().reset_index()
    else:
        print(f"Column '{col}' not found, skipping {sheet_name}.")

# Write to Excel
print(f"Writing Excel report to {OUTPUT_XLSX}")
# Generate GPT summary before writing Excel
print("Generating GPT summary...")
summary_prompt = f"Generate a compliance summary for the emissions report. Include key findings from the summaries by facility, energy source, and quarter."
summary = gpt_summary(summary_prompt)
print(summary)
with open(SUMMARY_TXT, 'w') as f:
    f.write(summary)

with pd.ExcelWriter(OUTPUT_XLSX, engine='openpyxl') as writer:
    df.to_excel(writer, sheet_name='Raw Data', index=False)
    for sheet_name, summary_df in summaries.items():
        summary_df.to_excel(writer, sheet_name=sheet_name, index=False)
    # Add summary as a new sheet
    pd.DataFrame({'Summary': [summary]}).to_excel(writer, sheet_name='Summary', index=False)

# Zapier integration: POST the Excel file
print("Posting report to Zapier webhook...")
with open(OUTPUT_XLSX, 'rb') as f:
    response = requests.post(ZAPIER_WEBHOOK, files={'file': f})
    print(f"Zapier response: {response.status_code} {response.text}")

print(f"✅ Emissions report (CO2 + CH4 only) saved to: {OUTPUT_XLSX}")
print(f"✅ Summary saved to: {SUMMARY_TXT}") 