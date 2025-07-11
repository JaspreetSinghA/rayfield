import os
import sys
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

def main():
    # =======================
    # 1. LOAD & CLEAN DATA
    # =======================
    input_csv = os.environ.get('SUBMISSION_CSV')
    if not input_csv and len(sys.argv) > 1:
        input_csv = sys.argv[1]
    if not input_csv:
        input_csv = 'flagged_emissions_output.csv'  # fallback for legacy/manual runs
    print(f"[week4.py] Using input file: {input_csv}")
    df = pd.read_csv(input_csv, encoding='latin1')
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
    print("[week4.py] Anomalies exported to alerts_today.csv")

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
    # df = pd.read_csv("final_output_with_summary.csv") # This line was removed as per the new_code

    # Drop rows with missing CO2 emission values
    # df = df.dropna(subset=["Unit CO2 emissions (non-biogenic) "]) # This line was removed as per the new_code

    # Run IsolationForest on CO2 emissions
    # model = IsolationForest(contamination=0.05, random_state=42) # This line was removed as per the new_code
    # df["anomaly"] = model.fit_predict(df[["Unit CO2 emissions (non-biogenic) "]]) == -1 # This line was removed as per the new_code

    # print(df["anomaly"].value_counts()) # This line was removed as per the new_code

    # import matplotlib.pyplot as plt # This line was removed as per the new_code

    # Convert Reporting Year to string (or use index if date not available)
    # df["Reporting Year"] = df["Reporting Year"].astype(str) # This line was removed as per the new_code

    # Filter anomalies
    # anomalies = df[df["anomaly"] == True] # This line was removed as per the new_code

    # Plot energy (CO2) output
    # plt.figure(figsize=(12, 6)) # This line was removed as per the new_code
    # plt.plot(df["Reporting Year"], df["Unit CO2 emissions (non-biogenic) "], label="CO2 Emissions", color="blue", marker='o') # This line was removed as per the new_code
    # plt.scatter(anomalies["Reporting Year"], anomalies["Unit CO2 emissions (non-biogenic) "], color="red", label="Anomalies", zorder=5) # This line was removed as per the new_code
    # plt.xlabel("Reporting Year") # This line was removed as per the new_code
    # plt.ylabel("CO2 Emissions (non-biogenic)") # This line was removed as per the new_code
    # plt.title("CO2 Emissions with Anomalies Highlighted") # This line was removed as per the new_code
    # plt.legend() # This line was removed as per the new_code
    # plt.grid(True) # This line was removed as per the new_code
    # plt.tight_layout() # This line was removed as per the new_code
    # plt.show() # This line was removed as per the new_code

    # Filter anomalies
    # anomalies = df[df["anomaly"] == True] # This line was removed as per the new_code

    # Print basic alert log
    # for i, row in anomalies.iterrows(): # This line was removed as per the new_code
    #     print(f"Anomaly detected — Facility: {row['Facility Name']} | Year: {row['Reporting Year']} | CO2: {row['Unit CO2 emissions (non-biogenic) ']}") # This line was removed as per the new_code

    # { # This block was removed as per the new_code
    #   "metadata": { # This block was removed as per the new_code
    #     "version": 2 # This block was removed as per the new_code
    #   }, # This block was removed as per the new_code
    #   "zaps": [ # This block was removed as per the new_code
    #     { # This block was removed as per the new_code
    #       "id": 1, # This block was removed as per the new_code
    #       "title": "Energy Anomaly ZAP", # This block was removed as per the new_code
    #       "nodes": { # This block was removed as per the new_code
    #         "1": { # This block was removed as per the new_code
    #           "id": 1, # This block was removed as per the new_code
    #           "paused": false, # This block was removed as per the new_code
    #           "type_of": "read", # This block was removed as per the new_code
    #           "params": { # This block was removed as per the new_code
    #             "includeDeleted": "false", # This block was removed as per the new_code
    #             "drive": "", # This block was removed as per the new_code
    #             "folder": "1_nSh3Yfp6MdGbjdAAd5IYlQYl5MflpVa" # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "meta": { # This block was removed as per the new_code
    #             "$editor": { # This block was removed as per the new_code
    #               "$zap_guesser": { # This block was removed as per the new_code
    #                 "generated_by_ai": true, # This block was removed as per the new_code
    #                 "zap_guesser_execution_id": "0197ebf1-faea-73ac-82f8-b1931e89ed80" # This block was removed as per the new_code
    #               }, # This block was removed as per the new_code
    #               "has_automatic_issues": false # This block was removed as per the new_code
    #             }, # This block was removed as per the new_code
    #             "parammap": { # This block was removed as per the new_code
    #               "drive": "My Google Drive", # This block was removed as per the new_code
    #               "folder": "Emissions Alerts" # This block was removed as per the new_code
    #             } # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "triple_stores": { # This block was removed as per the new_code
    #             "copied_from": null, # This block was removed as per the new_code
    #             "created_by": null, # This block was removed as per the new_code
    #             "polling_interval_override": 0, # This block was removed as per the new_code
    #             "block_and_release_limit_override": 0, # This block was removed as per the new_code
    #             "spread_tasks": 1 # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "parent_id": null, # This block was removed as per the new_code
    #           "root_id": null, # This block was removed as per the new_code
    #           "action": "file_in_folder_v2", # This block was removed as per the new_code
    #           "selected_api": "GoogleDriveCLIAPI@1.9.0", # This block was removed as per the new_code
    #           "title": "Energy Anomaly ZAP", # This block was removed as per the new_code
    #           "authentication_id": "521d7127de87a6e7fda992a1354527602f34d650c7d2ec421a71a6d98b627e5f" # This block was removed as per the new_code
    #         }, # This block was removed as per the new_code
    #         "2": { # This block was removed as per the new_code
    #           "id": 2, # This block was removed as per the new_code
    #           "paused": true, # This block was removed as per the new_code
    #           "type_of": "write", # This block was removed as per the new_code
    #           "params": { # This block was removed as per the new_code
    #             "drive": "", # This block was removed as per the new_code
    #             "spreadsheet": "1WF6QLajxB86CSnj0QfT8UuFf47ZdJ6YRQ3NYkJrTPnU", # This block was removed as per the new_code
    #             "worksheet": "1353225385", # This block was removed as per the new_code
    #             "COL$B": "19128.9343537414", # This block was removed as per the new_code
    #             "COL$C": "2010" # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "meta": { # This block was removed as per the new_code
    #             "$editor": { # This block was removed as per the new_code
    #               "$zap_guesser": { # This block was removed as per the new_code
    #                 "generated_by_ai": true, # This block was removed as per the new_code
    #                 "zap_guesser_execution_id": "0197ebf1-faea-73ac-82f8-b1931e89ed80" # This block was removed as per the new_code
    #               }, # This block was removed as per the new_code
    #               "has_automatic_issues": false # This block was removed as per the new_code
    #             }, # This block was removed as per the new_code
    #             "parammap": { # This block was removed as per the new_code
    #               "drive": "My Google Drive", # This block was removed as per the new_code
    #               "spreadsheet": "alerts_today (3)", # This block was removed as per the new_code
    #               "worksheet": "alerts_today (3).csv" # This block was removed as per the new_code
    #             } # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "triple_stores": { # This block was removed as per the new_code
    #             "copied_from": null, # This block was removed as per the new_code
    #             "created_by": null, # This block was removed as per the new_code
    #             "polling_interval_override": 0, # This block was removed as per the new_code
    #             "block_and_release_limit_override": 0, # This block was removed as per the new_code
    #             "spread_tasks": 1 # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "parent_id": 1, # This block was removed as per the new_code
    #           "root_id": 1, # This block was removed as per the new_code
    #           "action": "add_row_lines", # This block was removed as per the new_code
    #           "selected_api": "GoogleSheetsV2CLIAPI@2.5.4", # This block was removed as per the new_code
    #           "title": null, # This block was removed as per the new_code
    #           "authentication_id": "1d1bdf15a9a51f08564a086b4bdde2341e72aeaea1486238a9db7484b4b1b5c6" # This block was removed as per the new_code
    #         }, # This block was removed as per the new_code
    #         "3": { # This block was removed as per the new_code
    #           "id": 3, # This block was removed as per the new_code
    #           "paused": true, # This block was removed as per the new_code
    #           "type_of": "write", # This block was removed as per the new_code
    #           "params": { # This block was removed as per the new_code
    #             "folder": "1_nSh3Yfp6MdGbjdAAd5IYlQYl5MflpVa", # This block was removed as per the new_code
    #             "title": "Content from Google Drive Files", # This block was removed as per the new_code
    #             "file": "⚠️ 1 anomaly(s) detected.\nLast anomaly: 2010.0 with 19128.93 kWh.\n" # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "meta": { # This block was removed as per the new_code
    #             "$editor": { # This block was removed as per the new_code
    #               "$zap_guesser": { # This block was removed as per the new_code
    #                 "generated_by_ai": true, # This block was removed as per the new_code
    #                 "zap_guesser_execution_id": "0197ebf1-faea-73ac-82f8-b1931e89ed80" # This block was removed as per the new_code
    #               }, # This block was removed as per the new_code
    #               "has_automatic_issues": false # This block was removed as per the new_code
    #             }, # This block was removed as per the new_code
    #             "parammap": { # This block was removed as per the new_code
    #               "folder": "Emissions Alerts" # This block was removed as per the new_code
    #             } # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "triple_stores": { # This block was removed as per the new_code
    #             "copied_from": null, # This block was removed as per the new_code
    #             "created_by": null, # This block was removed as per the new_code
    #             "polling_interval_override": 0, # This block was removed as per the new_code
    #             "block_and_release_limit_override": 0, # This block was removed as per the new_code
    #             "spread_tasks": 1 # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "parent_id": 2, # This block was removed as per the new_code
    #           "root_id": 1, # This block was removed as per the new_code
    #           "action": "newtxtdocument", # This block was removed as per the new_code
    #           "selected_api": "GoogleDocsV2CLIAPI@1.2.4", # This block was removed as per the new_code
    #           "title": null, # This block was removed as per the new_code
    #           "authentication_id": "ca50eeb5d8d14f520257d7667a887e292fe431e94bfd2dcb8157cef97a11834a" # This block was removed as per the new_code
    #         }, # This block was removed as per the new_code
    #         "4": { # This block was removed as per the new_code
    #           "id": 4, # This block was removed as per the new_code
    #           "paused": true, # This block was removed as per the new_code
    #           "type_of": "write", # This block was removed as per the new_code
    #           "params": { # This block was removed as per the new_code
    #             "send_to_groups": false, # This block was removed as per the new_code
    #             "body_type": "plain", # This block was removed as per the new_code
    #             "to": [ # This block was removed as per the new_code
    #               "zfatima090708@gmail.com" # This block was removed as per the new_code
    #             ], # This block was removed as per the new_code
    #             "subject": "⚠️ Anomaly Detected", # This block was removed as per the new_code
    #             "from": "zfatima090708@gmail.com", # This block was removed as per the new_code
    #             "body": "Energy dip detected on 2025-07-08\nOutput: 3200 kWh (below threshold)\nWeekly summary: ⚠️ 1 anomaly(s) detected.\nLast anomaly: 2010.0 with 19128.93 kWh.", # This block was removed as per the new_code
    #             "file": [] # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "meta": { # This block was removed as per the new_code
    #             "$editor": { # This block was removed as per the new_code
    #               "has_automatic_issues": false # This block was removed as per the new_code
    #             }, # This block was removed as per the new_code
    #             "parammap": { # This block was removed as per the new_code
    #               "send_to_groups": "False", # This block was removed as per the new_code
    #               "body_type": "Plain", # This block was removed as per the new_code
    #               "from": "zfatima090708@gmail.com" # This block was removed as per the new_code
    #             } # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "triple_stores": { # This block was removed as per the new_code
    #             "copied_from": null, # This block was removed as per the new_code
    #             "created_by": null, # This block was removed as per the new_code
    #             "polling_interval_override": 0, # This block was removed as per the new_code
    #             "block_and_release_limit_override": 0, # This block was removed as per the new_code
    #             "spread_tasks": 1 # This block was removed as per the new_code
    #           }, # This block was removed as per the new_code
    #           "parent_id": 3, # This block was removed as per the new_code
    #           "root_id": 1, # This block was removed as per the new_code
    #           "action": "message", # This block was removed as per the new_code
    #           "selected_api": "GoogleMailV2CLIAPI@2.5.0", # This block was removed as per the new_code
    #           "title": null, # This block was removed as per the new_code
    #           "authentication_id": "146151f928f1c1a6a07de0bb5b961a9a3dfa091e7dc4451fe342c6eceabce04b" # This block was removed as per the new_code
    #         } # This block was removed as per the new_code
    #       } # This block was removed as per the new_code
    #     } # This block was removed as per the new_code
    #   ] # This block was removed as per the new_code
    # } # This block was removed as per the new_code