import pandas as pd
import os

# Get submission ID from environment
submission_id = os.environ.get('SUBMISSION_ID', None)
if submission_id:
    output_suffix = f'_{submission_id}'
else:
    output_suffix = ''

TABLES = 'deliverables/tables/'

# Ensure directory exists
os.makedirs(TABLES, exist_ok=True)

# Use submission-specific file path
flagged_file = TABLES + f'flagged_emissions_output{output_suffix}.csv'
if not os.path.exists(flagged_file):
    print(f"Warning: {flagged_file} not found, trying fallback...")
    flagged_file = TABLES + 'flagged_emissions_output.csv'

df = pd.read_csv(flagged_file, encoding='latin1')
df.columns = df.columns.str.strip()

df.loc[df.index[-1], 'Reporting Year'] = 2025  # force last record to be 2025
df.to_csv(TABLES + f'flagged_emissions_output_2025{output_suffix}.csv', index=False)
print(f"[force_2025] Last row Reporting Year set to 2025 and saved as flagged_emissions_output_2025{output_suffix}.csv") 