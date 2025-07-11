import os
import pandas as pd

# Test the file path logic
submission_id = "98"

# Check both possible locations for the files
results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deliverables', 'tables')
summary_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deliverables', 'logs')
# Also check the nested backend/deliverables location
results_dir_nested = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'deliverables', 'tables')
summary_dir_nested = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'deliverables', 'logs')

print(f"Current directory: {os.getcwd()}")
print(f"Results dir: {results_dir}")
print(f"Results dir nested: {results_dir_nested}")
print(f"Summary dir: {summary_dir}")
print(f"Summary dir nested: {summary_dir_nested}")

# Try primary location first, then nested location
anomalies_path = os.path.join(results_dir, f'final_output_with_anomalies_{submission_id}.csv')
summary_path = os.path.join(summary_dir, f'weekly_summary_{submission_id}.txt')
chart_path = os.path.join(results_dir, f'features_{submission_id}.csv')

print(f"Initial anomalies path: {anomalies_path}")
print(f"Initial summary path: {summary_path}")
print(f"Initial chart path: {chart_path}")

# If not found in primary location, try nested location
if not os.path.exists(anomalies_path):
    anomalies_path = os.path.join(results_dir_nested, f'final_output_with_anomalies_{submission_id}.csv')
    print(f"Trying nested anomalies path: {anomalies_path}")
if not os.path.exists(summary_path):
    summary_path = os.path.join(summary_dir_nested, f'weekly_summary_{submission_id}.txt')
    print(f"Trying nested summary path: {summary_path}")
if not os.path.exists(chart_path):
    chart_path = os.path.join(results_dir_nested, f'features_{submission_id}.csv')
    print(f"Trying nested chart path: {chart_path}")

print(f"Final anomalies path: {anomalies_path}")
print(f"Final summary path: {summary_path}")
print(f"Final chart path: {chart_path}")

print(f"Anomalies exists: {os.path.exists(anomalies_path)}")
print(f"Summary exists: {os.path.exists(summary_path)}")
print(f"Chart exists: {os.path.exists(chart_path)}")

# Try to read the anomalies file
if os.path.exists(anomalies_path):
    try:
        df = pd.read_csv(anomalies_path)
        df.columns = df.columns.str.strip()
        print(f"Successfully loaded anomalies file: {anomalies_path}, shape={df.shape}")
        print(f"Columns: {list(df.columns)}")
    except Exception as e:
        print(f"Error loading anomalies file: {e}") 