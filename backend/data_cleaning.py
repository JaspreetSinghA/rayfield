import pandas as pd

# Load with correct encoding
df = pd.read_csv('emissions_by_unit.csv', encoding='latin1')

# Drop rows with any missing values
df_clean = df.dropna()

# Optional: Check how many rows remain after dropping missing values
print("Rows before cleaning:", len(df))
print("Rows after cleaning:", len(df_clean))

# Check if there are still missing values
print(df_clean.isnull().sum())

# Preview cleaned data
print(df_clean.head())
df_clean.to_csv('cleaned_emissions_by_unit.csv', index=False) 