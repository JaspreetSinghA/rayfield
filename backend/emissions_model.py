import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Load cleaned data
# Updated path

df = pd.read_csv("deliverables/tables/cleaned_emissions_by_unit.csv")

# Prepare features and target
df['Reporting Year'] = df['Reporting Year'].astype(int)
X = df[['Reporting Year']]
y = df['Unit CO2 emissions (non-biogenic) ']  # Keep trailing space

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict and calculate deviation
df['Predicted CO2'] = model.predict(X)
df['Deviation (%)'] = ((df['Unit CO2 emissions (non-biogenic) '] - df['Predicted CO2']) / df['Predicted CO2']) * 100

df['Flagged'] = df['Deviation (%)'].apply(lambda x: 'Yes' if abs(x) > 15 else 'No')

# Print flagged count
flagged_counts = df['Flagged'].value_counts()
print(flagged_counts)

# Show a clean output sample table
print(df[['Facility Id', 'Reporting Year', 'Unit CO2 emissions (non-biogenic) ',
          'Predicted CO2', 'Deviation (%)', 'Flagged']].head(10))

# Save output for Day 4
# Updated path
df.to_csv("deliverables/tables/flagged_emissions_output.csv", index=False) 