import pandas as pd
import matplotlib.pyplot as plt

# Load cleaned data
df_clean = pd.read_csv('cleaned_emissions_by_unit.csv')

# Look at basic statistics
print(df_clean.describe())

# Calculate total emissions by reporting year
emissions_by_year = df_clean.groupby('Reporting Year')['Unit CO2 emissions (non-biogenic)'].sum()
print("\nTotal CO2 emissions by year:")
print(emissions_by_year)

# Plot CO2 emissions over time
plt.figure(figsize=(10, 6))
emissions_by_year.plot(kind='line', marker='o')
plt.title('Total CO2 Emissions Over Time')
plt.ylabel('CO2 Emissions (metric tons)')
plt.xlabel('Year')
plt.grid(True)
plt.show()

# Analyze emissions by industry type
emissions_by_industry = df_clean.groupby('Industry Type (sectors)')['Unit CO2 emissions (non-biogenic)'].sum().sort_values(ascending=False)
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
plt.show()

# Total CO2 emissions by year (with trailing space in column name)
emissions_by_year2 = df_clean.groupby('Reporting Year')['Unit CO2 emissions (non-biogenic) '].sum()
print("\nTotal CO2 emissions by year (with trailing space):")
print(emissions_by_year2)

# Plot CO2 emissions over years
plt.figure(figsize=(8, 5))
emissions_by_year2.plot(kind='line', marker='o', color='green')
plt.title('Total CO2 Emissions by Year')
plt.ylabel('CO2 Emissions (metric tons)')
plt.xlabel('Year')
plt.grid()
plt.show()

# Total methane emissions by year
methane_by_year = df_clean.groupby('Reporting Year')['Unit Methane (CH4) emissions '].sum()
print("\nTotal Methane emissions by year:")
print(methane_by_year)

# Plot Methane emissions
plt.figure(figsize=(8, 5))
methane_by_year.plot(kind='line', marker='o', color='orange')
plt.title('Total Methane (CH4) Emissions by Year')
plt.ylabel('CH4 Emissions (metric tons)')
plt.xlabel('Year')
plt.grid()
plt.show() 