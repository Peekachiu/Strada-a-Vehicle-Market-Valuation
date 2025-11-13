import pandas as pd

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

try:
    for file in file_list:
        print(f"Loading {file}...")
        df = pd.read_csv(file)

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
        output_filename = "malaysia_master_dataset.csv"
        master_df.to_csv(output_filename, index=False)

        print(f"\n--- [Success!] ---")
        print(f"Successfully saved all {len(master_df)} records to '{output_filename}'.")

except Exception as e:
    print(f"An error occurred: {e}")