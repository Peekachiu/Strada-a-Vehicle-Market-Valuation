import pandas as pd
import os

# --- THIS IS THE CHANGE ---
# Define the relative path to go "up one level" to the root,
# then "down into" the datasets folder.
DATA_FOLDER = '../datasets/'
OUTPUT_FILE = os.path.join(DATA_FOLDER, 'malaysia_master_dataset.csv')
# ---

# List of all the dataset files to be combined
file_list = [
    "honda_models_market_aligned.csv",
    "mazda_multiple_models_market_aligned.csv",
    "nissan_multiple_models_market_aligned.csv",
    "lexus_multiple_models_market_aligned.csv",
    "toyota_multiple_models_market_aligned.csv"
]

all_dfs = []
print(f"Starting to load and combine {len(file_list)} datasets...")
print(f"Looking for data in: {os.path.abspath(DATA_FOLDER)}")

try:
    for file in file_list:
        # Create the full path to the file
        file_path = os.path.join(DATA_FOLDER, file) 
        
        print(f"Loading {file_path}...")
        df = pd.read_csv(file_path)
        
        if df.empty:
            print(f"Warning: {file} is empty and will be skipped.")
            continue
        
        # Check for required columns
        required_cols = ['make', 'model', 'year', 'mileage_km', 'condition', 'transmission', 'fuel_type', 'price_rm']
        if not all(col in df.columns for col in required_cols):
            print(f"Error: {file} is missing one of the required columns. Aborting.")
            raise ValueError(f"Column mismatch in {file}.")
            
        all_dfs.append(df)
        print(f"Successfully loaded {len(df)} records from {file}.")

    if not all_dfs:
        print("No data was loaded.")
    else:
        # Combine all DataFrames into one
        master_df = pd.concat(all_dfs, ignore_index=True)
        
        print("\n--- [All Files Combined Successfully] ---")
        master_df.info()
        
        print("\nBrand Counts in Master Dataset:")
        print(master_df['make'].str.title().value_counts())
        
        # Save the Master File
        master_df.to_csv(OUTPUT_FILE, index=False)
        
        print(f"\n--- [Success!] ---")
        print(f"Successfully saved all {len(master_df)} records to '{OUTPUT_FILE}'.")

except Exception as e:
    print(f"An error occurred: {e}")