import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import IsolationForest
from sklearn.metrics import mean_squared_error

# Feature engineering: add rolling average and percent change
def add_features(df, target_col='Unit CO2 emissions (non-biogenic) '):
    df = df.copy()
    df['rolling_7d'] = df[target_col].rolling(window=7, min_periods=1).mean()
    df['pct_change'] = df[target_col].pct_change().fillna(0)
    return df

# Train a linear regression model
def train_regression(X, y):
    model = LinearRegression()
    model.fit(X, y)
    return model

# Predict using a trained model
def predict(model, X):
    return model.predict(X)

# Example: GridSearchCV for regression (can be extended)
def tune_regression(X, y):
    params = {'fit_intercept': [True, False]}
    grid = GridSearchCV(LinearRegression(), param_grid=params, cv=3)
    grid.fit(X, y)
    return grid.best_estimator_, grid.best_params_

# Anomaly detection using IsolationForest
def train_anomaly_detector(X):
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(X)
    return model

def predict_anomalies(model, X):
    return model.predict(X) == -1 