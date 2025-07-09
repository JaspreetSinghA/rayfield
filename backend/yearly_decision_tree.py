import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

# Load and clean data
TABLES = 'backend/deliverables/tables/'
PLOTS = 'backend/deliverables/plots/'
df = pd.read_csv(TABLES + 'flagged_emissions_output.csv', encoding='latin1')
df.columns = df.columns.str.strip()

# Create year_index and aggregate average CO2 per year
df["year_index"] = df["Reporting Year"] - df["Reporting Year"].min()
yearly_avg = df.groupby("year_index")["Unit CO2 emissions (non-biogenic)"].mean().reset_index()

X = yearly_avg[["year_index"]]
y = yearly_avg["Unit CO2 emissions (non-biogenic)"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Grid search for best DecisionTreeRegressor max_depth
params = {"max_depth": [2, 5, 10, 20, None]}
grid = GridSearchCV(DecisionTreeRegressor(random_state=42), param_grid=params, cv=3)
grid.fit(X_train, y_train)

print("Best params:", grid.best_params_)

# Use best model for predictions on test and all data
best_model = grid.best_estimator_
preds_test = best_model.predict(X_test)
preds_all = best_model.predict(X)

# Evaluate test MSE
mse = mean_squared_error(y_test, preds_test)
print("Test MSE:", mse)

# Prepare dataframe for plotting
results = yearly_avg.copy()
results["Predicted"] = preds_all

# Plot actual vs predicted yearly average CO2 emissions
plt.figure(figsize=(10,5))
plt.plot(results["year_index"], results["Unit CO2 emissions (non-biogenic)"], label="Actual (yearly avg)", marker='o')
plt.plot(results["year_index"], results["Predicted"], label="Predicted", marker='x')
plt.xlabel("Year Index")
plt.ylabel("Average CO2 Emissions (non-biogenic)")
plt.title("Decision Tree Regression: Forecast vs Actual")
plt.legend()
plt.tight_layout()
plt.savefig(PLOTS + 'yearly_decision_tree_forecast_vs_actual.png')
plt.show() 