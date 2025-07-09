import pandas as pd

# Load with correct encoding
df = pd.read_csv('emissions_by_unit.csv', encoding='latin1')

# Preview first rows
df.head() 