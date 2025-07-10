import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# =======================
# 1. LOAD & CLEAN DATA
# =======================
df = pd.read_csv('flagged_emissions_output.csv', encoding='latin1')
df.columns = df.columns.str.strip()

# ✅ Force last row to be in 2025 (for Zapier testing)
df.loc[df.index[-1], 'Reporting Year'] = 2025  # force last record to be 2025

# Create year_index
df["year_index"] = df["Reporting Year"] - df["Reporting Year"].min()
min_year = df["Reporting Year"].min()  # used to convert index back to actual year

# =======================
# 2. GROUP & TRAIN MODEL
# =======================
yearly_avg = df.groupby("year_index")["Unit CO2 emissions (non-biogenic)"].mean().reset_index()

X = yearly_avg[["year_index"]]
y = yearly_avg["Unit CO2 emissions (non-biogenic)"]

model = LinearRegression()
model.fit(X, y)

yearly_avg["Predicted"] = model.predict(X)
yearly_avg["error"] = abs(yearly_avg["Unit CO2 emissions (non-biogenic)"] - yearly_avg["Predicted"])

# =======================
# 3. DETECT ANOMALIES
# =======================
threshold = yearly_avg["error"].mean() + 1.5 * yearly_avg["error"].std()
yearly_avg["anomaly"] = yearly_avg["error"] > threshold

# Filter anomalies
anomalies = yearly_avg[yearly_avg["anomaly"] == True][["year_index", "Unit CO2 emissions (non-biogenic)"]]
anomalies = anomalies.rename(columns={
    "year_index": "index",
    "Unit CO2 emissions (non-biogenic)": "output_kwh"
})

# Convert year_index back to Reporting Year
anomalies["Reporting Year"] = anomalies["index"] + min_year
anomalies["Reporting Year"] = anomalies["Reporting Year"].astype(int)

# =======================
# 4. EXPORT CSV + SUMMARY
# =======================
# Save anomalies to CSV
anomalies.to_csv("alerts_today.csv", index=False)

# Generate summary text
def generate_summary(df):
    if df.empty:
        return "✅ No anomalies detected this week."

    summary = f"⚠️ {len(df)} anomaly(s) detected.\n"
    latest = df.sort_values("Reporting Year", ascending=False).iloc[0]
    summary += f"Last anomaly: {latest['Reporting Year']} with {float(latest['output_kwh']):.2f} kWh."
    return summary

summary = generate_summary(anomalies)

# Save summary to text file
with open("weekly_summary.txt", "w") as f:
    f.write(summary)

print("✅ alerts_today.csv and weekly_summary.txt created!")

# =======================
# 5. OPTIONAL: PLOT
# =======================
plt.figure(figsize=(10, 5))
plt.plot(yearly_avg["year_index"], yearly_avg["Unit CO2 emissions (non-biogenic)"], label="Actual", marker='o')
plt.plot(yearly_avg["year_index"], yearly_avg["Predicted"], label="Predicted", marker='x')
plt.scatter(
    yearly_avg[yearly_avg["anomaly"]]["year_index"],
    yearly_avg[yearly_avg["anomaly"]]["Unit CO2 emissions (non-biogenic)"],
    color='red', label="Anomalies", zorder=5
)
plt.title("AI-Detected Emissions Anomalies")
plt.xlabel("Year Index")
plt.ylabel("Average CO2 Emissions")
plt.legend()
plt.grid(True)
plt.show()


import pandas as pd
from sklearn.ensemble import IsolationForest
df = pd.read_csv("final_output_with_summary.csv")

# Drop rows with missing CO2 emission values
df = df.dropna(subset=["Unit CO2 emissions (non-biogenic) "])

# Run IsolationForest on CO2 emissions
model = IsolationForest(contamination=0.05, random_state=42)
df["anomaly"] = model.fit_predict(df[["Unit CO2 emissions (non-biogenic) "]]) == -1

print(df["anomaly"].value_counts())

import matplotlib.pyplot as plt

# Convert Reporting Year to string (or use index if date not available)
df["Reporting Year"] = df["Reporting Year"].astype(str)

# Filter anomalies
anomalies = df[df["anomaly"] == True]

# Plot energy (CO2) output
plt.figure(figsize=(12, 6))
plt.plot(df["Reporting Year"], df["Unit CO2 emissions (non-biogenic) "], label="CO2 Emissions", color="blue", marker='o')
plt.scatter(anomalies["Reporting Year"], anomalies["Unit CO2 emissions (non-biogenic) "], color="red", label="Anomalies", zorder=5)
plt.xlabel("Reporting Year")
plt.ylabel("CO2 Emissions (non-biogenic)")
plt.title("CO2 Emissions with Anomalies Highlighted")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# Filter anomalies
anomalies = df[df["anomaly"] == True]

# Print basic alert log
for i, row in anomalies.iterrows():
    print(f"Anomaly detected — Facility: {row['Facility Name']} | Year: {row['Reporting Year']} | CO2: {row['Unit CO2 emissions (non-biogenic) ']}")

{
  "metadata": {
    "version": 2
  },
  "zaps": [
    {
      "id": 1,
      "title": "Energy Anomaly ZAP",
      "nodes": {
        "1": {
          "id": 1,
          "paused": false,
          "type_of": "read",
          "params": {
            "includeDeleted": "false",
            "drive": "",
            "folder": "1_nSh3Yfp6MdGbjdAAd5IYlQYl5MflpVa"
          },
          "meta": {
            "$editor": {
              "$zap_guesser": {
                "generated_by_ai": true,
                "zap_guesser_execution_id": "0197ebf1-faea-73ac-82f8-b1931e89ed80"
              },
              "has_automatic_issues": false
            },
            "parammap": {
              "drive": "My Google Drive",
              "folder": "Emissions Alerts"
            }
          },
          "triple_stores": {
            "copied_from": null,
            "created_by": null,
            "polling_interval_override": 0,
            "block_and_release_limit_override": 0,
            "spread_tasks": 1
          },
          "parent_id": null,
          "root_id": null,
          "action": "file_in_folder_v2",
          "selected_api": "GoogleDriveCLIAPI@1.9.0",
          "title": "Energy Anomaly ZAP",
          "authentication_id": "521d7127de87a6e7fda992a1354527602f34d650c7d2ec421a71a6d98b627e5f"
        },
        "2": {
          "id": 2,
          "paused": true,
          "type_of": "write",
          "params": {
            "drive": "",
            "spreadsheet": "1WF6QLajxB86CSnj0QfT8UuFf47ZdJ6YRQ3NYkJrTPnU",
            "worksheet": "1353225385",
            "COL$B": "19128.9343537414",
            "COL$C": "2010"
          },
          "meta": {
            "$editor": {
              "$zap_guesser": {
                "generated_by_ai": true,
                "zap_guesser_execution_id": "0197ebf1-faea-73ac-82f8-b1931e89ed80"
              },
              "has_automatic_issues": false
            },
            "parammap": {
              "drive": "My Google Drive",
              "spreadsheet": "alerts_today (3)",
              "worksheet": "alerts_today (3).csv"
            }
          },
          "triple_stores": {
            "copied_from": null,
            "created_by": null,
            "polling_interval_override": 0,
            "block_and_release_limit_override": 0,
            "spread_tasks": 1
          },
          "parent_id": 1,
          "root_id": 1,
          "action": "add_row_lines",
          "selected_api": "GoogleSheetsV2CLIAPI@2.5.4",
          "title": null,
          "authentication_id": "1d1bdf15a9a51f08564a086b4bdde2341e72aeaea1486238a9db7484b4b1b5c6"
        },
        "3": {
          "id": 3,
          "paused": true,
          "type_of": "write",
          "params": {
            "folder": "1_nSh3Yfp6MdGbjdAAd5IYlQYl5MflpVa",
            "title": "Content from Google Drive Files",
            "file": "⚠️ 1 anomaly(s) detected.\nLast anomaly: 2010.0 with 19128.93 kWh.\n"
          },
          "meta": {
            "$editor": {
              "$zap_guesser": {
                "generated_by_ai": true,
                "zap_guesser_execution_id": "0197ebf1-faea-73ac-82f8-b1931e89ed80"
              },
              "has_automatic_issues": false
            },
            "parammap": {
              "folder": "Emissions Alerts"
            }
          },
          "triple_stores": {
            "copied_from": null,
            "created_by": null,
            "polling_interval_override": 0,
            "block_and_release_limit_override": 0,
            "spread_tasks": 1
          },
          "parent_id": 2,
          "root_id": 1,
          "action": "newtxtdocument",
          "selected_api": "GoogleDocsV2CLIAPI@1.2.4",
          "title": null,
          "authentication_id": "ca50eeb5d8d14f520257d7667a887e292fe431e94bfd2dcb8157cef97a11834a"
        },
        "4": {
          "id": 4,
          "paused": true,
          "type_of": "write",
          "params": {
            "send_to_groups": false,
            "body_type": "plain",
            "to": [
              "zfatima090708@gmail.com"
            ],
            "subject": "⚠️ Anomaly Detected",
            "from": "zfatima090708@gmail.com",
            "body": "Energy dip detected on 2025-07-08\nOutput: 3200 kWh (below threshold)\nWeekly summary: ⚠️ 1 anomaly(s) detected.\nLast anomaly: 2010.0 with 19128.93 kWh.",
            "file": []
          },
          "meta": {
            "$editor": {
              "has_automatic_issues": false
            },
            "parammap": {
              "send_to_groups": "False",
              "body_type": "Plain",
              "from": "zfatima090708@gmail.com"
            }
          },
          "triple_stores": {
            "copied_from": null,
            "created_by": null,
            "polling_interval_override": 0,
            "block_and_release_limit_override": 0,
            "spread_tasks": 1
          },
          "parent_id": 3,
          "root_id": 1,
          "action": "message",
          "selected_api": "GoogleMailV2CLIAPI@2.5.0",
          "title": null,
          "authentication_id": "146151f928f1c1a6a07de0bb5b961a9a3dfa091e7dc4451fe342c6eceabce04b"
        }
      }
    }
  ]
}