import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

# Load and clean
# Use the output from the main pipeline

TABLES = 'backend/deliverables/tables/'
PLOTS = 'backend/deliverables/plots/'
df = pd.read_csv(TABLES + 'flagged_emissions_output.csv', encoding='latin1')
df.columns = df.columns.str.strip()

# Create year_index
if 'Reporting Year' not in df.columns:
    raise ValueError('Reporting Year column not found in input file.')
df["year_index"] = df["Reporting Year"] - df["Reporting Year"].min()

# Aggregate: average CO2 emissions per year_index
if 'Unit CO2 emissions (non-biogenic)' in df.columns:
    co2_col = 'Unit CO2 emissions (non-biogenic)'
else:
    co2_col = 'Unit CO2 emissions (non-biogenic) '

yearly_avg = df.groupby("year_index")[co2_col].mean().reset_index()

X = yearly_avg[["year_index"]]
y = yearly_avg[co2_col]

# Split train/test on yearly data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict on test set and full yearly data
preds_test = model.predict(X_test)
preds_all = model.predict(X)

# Evaluate on test set
mse = mean_squared_error(y_test, preds_test)
print("Mean Squared Error (test):", mse)

# Prepare dataframe for plotting
results = yearly_avg.copy()
results["Predicted"] = preds_all

# Plot
plt.figure(figsize=(10,5))
plt.plot(results["year_index"], results[co2_col], label="Actual (yearly avg)", marker='o')
plt.plot(results["year_index"], results["Predicted"], label="Predicted", marker='x')
plt.xlabel("Year Index")
plt.ylabel("Average CO2 Emissions (non-biogenic)")
plt.title("Forecast vs Actual CO2 Emissions (Yearly Average)")
plt.legend()
plt.tight_layout()
plt.savefig(PLOTS + 'yearly_forecast_vs_actual.png')
plt.show()

importance = model.coef_
print("Feature importances:", importance) 