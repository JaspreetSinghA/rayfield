import pandas as pd

TABLES = 'backend/deliverables/tables/'
df = pd.read_csv(TABLES + 'flagged_emissions_output.csv', encoding='latin1')
df.columns = df.columns.str.strip()

df.loc[df.index[-1], 'Reporting Year'] = 2025  # force last record to be 2025
df.to_csv(TABLES + 'flagged_emissions_output_2025.csv', index=False)
print("[force_2025] Last row Reporting Year set to 2025 and saved as flagged_emissions_output_2025.csv") 