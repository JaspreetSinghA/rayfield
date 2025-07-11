import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import IsolationForest
from sklearn.metrics import mean_squared_error, r2_score
import os
from dotenv import load_dotenv

# Feature engineering: add rolling average and percent change
def add_features(df):
    df = df.copy()
    df.columns = df.columns.str.strip()
    # Find the correct CO2 column name
    target_col = next((c for c in df.columns if c.startswith('Unit CO2 emissions (non-biogenic)')), None)
    if target_col is None:
        raise KeyError("Could not find CO2 emissions column in input data.")
    # Add rolling 7-day mean
    df['rolling_7d'] = df[target_col].rolling(window=7, min_periods=1).mean()
    # Add percent change
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
def train_anomaly_detector(X, contamination=0.05):
    model = IsolationForest(contamination=contamination, random_state=42)
    model.fit(X)
    return model

def predict_anomalies(model, X):
    return model.predict(X) == -1 

# GPT summary integration
try:
    import openai
except ImportError:
    openai = None

def gpt_summary(prompt_text):
    load_dotenv()
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or not openai:
        return generate_mock_summary_text(prompt_text)
    openai.api_key = api_key
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt_text}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"[GPT ERROR] {str(e)}\n" + generate_mock_summary_text(prompt_text)

def generate_mock_summary_text(prompt_text):
    return f"[MOCK SUMMARY] {prompt_text}" 

def regression_metrics(model, X, y):
    """Calculate regression metrics."""
    y_pred = model.predict(X)
    from sklearn.metrics import mean_squared_error, r2_score
    mse = mean_squared_error(y, y_pred)
    rmse = mse ** 0.5  # Calculate RMSE manually
    r2 = r2_score(y, y_pred)
    return {
        'mse': mse,
        'rmse': rmse,
        'r2': r2
    }


def explain_anomaly(row):
    """Generate a short explanation for an anomaly row."""
    actual = row.get('Unit CO2 emissions (non-biogenic)', None)
    predicted = row.get('Predicted CO2', None)
    deviation = row.get('Deviation (%)', None)
    if actual is not None and predicted is not None and deviation is not None:
        return f"Actual ({actual:.2f}) is {deviation:.1f}% {'above' if deviation > 0 else 'below'} predicted ({predicted:.2f})."
    return "Deviation from expected value detected." 