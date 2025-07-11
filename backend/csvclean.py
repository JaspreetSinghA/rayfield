import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

def generate_mock_summary(df, co2_col):
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
- Facility {example_1['Facility Id']} reported {example_1[co2_col]:.0f} vs predicted {example_1['Predicted CO2']:.0f} → deviation: {example_1['Deviation (%)']:.1f}%
- Facility {example_2['Facility Id']} reported {example_2[co2_col]:.0f} vs predicted {example_2['Predicted CO2']:.0f} → deviation: {example_2['Deviation (%)']:.1f}%

This summary supports audit readiness by highlighting key anomalies.
"""
    return summary

def main():
    import os
    os.makedirs('deliverables/tables', exist_ok=True)
    os.makedirs('deliverables/plots', exist_ok=True)
    
    # Get submission ID from environment
    submission_id = os.environ.get('SUBMISSION_ID', None)
    if submission_id:
        output_suffix = f'_{submission_id}'
    else:
        output_suffix = ''
    
    # Use the environment variable or a command-line argument for the input file
    input_csv = os.environ.get('SUBMISSION_CSV')
    if not input_csv and len(sys.argv) > 1:
        input_csv = sys.argv[1]
    if not input_csv:
        input_csv = 'deliverables/tables/emissions_by_unit.csv'  # fallback for legacy/manual runs
    print(f"[csvclean.py] Using input file: {input_csv}")
    df = pd.read_csv(input_csv, encoding='latin1')
    df.columns = df.columns.str.strip()

    # Preview first rows
    print(df.head())

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
    df_clean.to_csv(f'deliverables/tables/cleaned_emissions_by_unit{output_suffix}.csv', index=False)

    # Look at basic statistics
    print(df_clean.describe())

    # Find the correct CO2 column name
    co2_col = None
    for col in df_clean.columns:
        if col.startswith('Unit CO2 emissions (non-biogenic)'):
            co2_col = col
            break
    if co2_col is None:
        raise KeyError("Could not find CO2 emissions column in input data.")

    # Calculate total emissions by reporting year
    emissions_by_year = df_clean.groupby('Reporting Year')[co2_col].sum()
    print("\nTotal CO2 emissions by year:")
    print(emissions_by_year)

    # Plot CO2 emissions over time
    plt.figure(figsize=(10, 6))
    emissions_by_year.plot(kind='line', marker='o')
    plt.title('Total CO2 Emissions Over Time')
    plt.ylabel('CO2 Emissions (metric tons)')
    plt.xlabel('Year')
    plt.grid(True)
    plt.savefig(f'deliverables/plots/co2_emissions_over_time{output_suffix}.png')
    plt.close()

    # Analyze emissions by industry type
    emissions_by_industry = df_clean.groupby('Industry Type (sectors)')[co2_col].sum().sort_values(ascending=False)
    print("\nTotal CO2 emissions by industry sector:")
    print(emissions_by_industry)

    # Plot total CO2 emissions by industry type
    plt.figure(figsize=(12, 6))
    emissions_by_industry.plot(kind='bar')
    plt.title('Total CO2 Emissions by Industry Sector')
    plt.ylabel('CO2 Emissions (metric tons)')
    plt.xlabel('Industry Sector')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(f'deliverables/plots/co2_emissions_by_industry{output_suffix}.png')
    plt.close()

    # Check descriptive statistics
    print(df_clean.describe())

    # Total CO2 emissions by year
    emissions_by_year = df_clean.groupby('Reporting Year')[co2_col].sum()
    print("\nTotal CO2 emissions by year:")
    print(emissions_by_year)

    # Plot CO2 emissions over years
    plt.figure(figsize=(8, 5))
    emissions_by_year.plot(kind='line', marker='o', color='green')
    plt.title('Total CO2 Emissions by Year')
    plt.ylabel('CO2 Emissions (metric tons)')
    plt.xlabel('Year')
    plt.grid()
    plt.savefig(f'deliverables/plots/co2_emissions_by_year{output_suffix}.png')
    plt.close()

    # Find methane column name
    methane_col = None
    for col in df_clean.columns:
        if col.startswith('Unit Methane (CH4) emissions'):
            methane_col = col
            break
    if methane_col:
        methane_by_year = df_clean.groupby('Reporting Year')[methane_col].sum()
        print("\nTotal Methane emissions by year:")
        print(methane_by_year)

        # Plot Methane emissions
        plt.figure(figsize=(8, 5))
        methane_by_year.plot(kind='line', marker='o', color='orange')
        plt.title('Total Methane (CH4) Emissions by Year')
        plt.ylabel('CH4 Emissions (metric tons)')
        plt.xlabel('Year')
        plt.grid()
        plt.savefig(f'deliverables/plots/methane_emissions_by_year{output_suffix}.png')
        plt.close()

    # Reload cleaned data for modeling
    df = pd.read_csv(f"deliverables/tables/cleaned_emissions_by_unit{output_suffix}.csv")
    df.columns = df.columns.str.strip()
    print(df.head())

    # Step 1: Prepare features and target
    df['Reporting Year'] = df['Reporting Year'].astype(int)
    X = df[['Reporting Year']]
    y = df[co2_col]  # Use the correct CO2 column

    # Step 2: Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Step 3: Train the model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Step 4: Predict and calculate deviation
    df['Predicted CO2'] = model.predict(X)
    df['Deviation (%)'] = ((df[co2_col] - df['Predicted CO2']) / df['Predicted CO2']) * 100

    # OPTIONAL: Adjust threshold if too many records are flagged
    # Use 25% if 15% gives too many false positives
    df['Flagged'] = df['Deviation (%)'].apply(lambda x: 'Yes' if abs(x) > 15 else 'No')

    # Step 5: Print flagged count
    flagged_counts = df['Flagged'].value_counts()
    print(flagged_counts)

    # Step 6: Show a clean output sample table
    print(df[['Facility Id', 'Reporting Year', co2_col,
              'Predicted CO2', 'Deviation (%)', 'Flagged']].head(10))

    # Step 7: Save output for Day 4
    df.to_csv(f"deliverables/tables/flagged_emissions_output{output_suffix}.csv", index=False)

    # Load the output file from Task 2.3
    df_flagged = pd.read_csv(f"deliverables/tables/flagged_emissions_output{output_suffix}.csv")
    df_flagged.columns = df_flagged.columns.str.strip()

    # Filter for flagged records only
    flagged = df_flagged[df_flagged['Flagged'] == 'Yes']

    # Quick sanity check
    print("Number of flagged records:", len(flagged))

    # Optional: Preview top records
    print(flagged[['Facility Id', 'Reporting Year', co2_col,
                   'Predicted CO2', 'Deviation (%)']].head(5))

    summary = generate_mock_summary(df_flagged, co2_col)
    print(summary)
    with open(f"deliverables/tables/weekly_summary{output_suffix}.txt", "w") as f:
        f.write(summary)

    df_flagged['summary'] = summary
    df_flagged.to_csv(f"deliverables/tables/final_output_with_summary{output_suffix}.csv", index=False)

if __name__ == "__main__":
    main()
