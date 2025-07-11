import os
import sys
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

class EmissionsModel:
    def __init__(self, input_csv=None):
        self.input_csv = input_csv

    def run(self):
        import os
        os.makedirs('deliverables/tables', exist_ok=True)
        
        # Get submission ID from environment
        submission_id = os.environ.get('SUBMISSION_ID', None)
        if submission_id:
            output_suffix = f'_{submission_id}'
        else:
            output_suffix = ''
        
        input_csv = self.input_csv
        if input_csv is None:
            input_csv = os.environ.get('SUBMISSION_CSV')
        if not input_csv and len(sys.argv) > 1:
            input_csv = sys.argv[1]
        if not input_csv:
            input_csv = f"deliverables/tables/cleaned_emissions_by_unit{output_suffix}.csv"
            if not os.path.exists(input_csv):
                input_csv = "deliverables/tables/cleaned_emissions_by_unit.csv"
        
        print(f"[emissions_model.py] Using input file: {input_csv}")
        df = pd.read_csv(input_csv)
        df.columns = df.columns.str.strip()
        df['Reporting Year'] = df['Reporting Year'].astype(int)
        X = df[['Reporting Year']]
        y = df['Unit CO2 emissions (non-biogenic)']  # Keep trailing space
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)
        df['Predicted CO2'] = model.predict(X)
        df['Deviation (%)'] = ((df['Unit CO2 emissions (non-biogenic)'] - df['Predicted CO2']) / df['Predicted CO2']) * 100
        df['Flagged'] = df['Deviation (%)'].apply(lambda x: 'Yes' if abs(x) > 15 else 'No')
        flagged_counts = df['Flagged'].value_counts()
        print(flagged_counts)
        print(df[['Facility Id', 'Reporting Year', 'Unit CO2 emissions (non-biogenic)',
                  'Predicted CO2', 'Deviation (%)', 'Flagged']].head(10))
        df.to_csv(f"deliverables/tables/flagged_emissions_output{output_suffix}.csv", index=False)

if __name__ == "__main__":
    model = EmissionsModel()
    model.run() 