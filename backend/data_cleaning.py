import os
import sys
import pandas as pd

def main():
    import os
    os.makedirs('deliverables/tables', exist_ok=True)
    # Use the environment variable or a command-line argument for the input file
    input_csv = os.environ.get('SUBMISSION_CSV')
    if not input_csv and len(sys.argv) > 1:
        input_csv = sys.argv[1]
    if not input_csv:
        input_csv = 'deliverables/tables/emissions_by_unit.csv'  # fallback for legacy/manual runs
    print(f"[data_cleaning.py] Using input file: {input_csv}")
    df = pd.read_csv(input_csv, encoding='latin1')
    df.columns = df.columns.str.strip()
    # Drop rows with any missing values
    df_clean = df.dropna()
    df_clean.columns = df_clean.columns.str.strip()
    # Optional: Check how many rows remain after dropping missing values
    print("Rows before cleaning:", len(df))
    print("Rows after cleaning:", len(df_clean))
    # Check if there are still missing values
    print(df_clean.isnull().sum())
    # Preview cleaned data
    print(df_clean.head())
    df_clean.to_csv('deliverables/tables/cleaned_emissions_by_unit.csv', index=False)

if __name__ == "__main__":
    main() 