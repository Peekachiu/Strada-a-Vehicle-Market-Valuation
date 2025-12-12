import pandas as pd
import numpy as np
import random

# 1. Configuration: Target Brands and Models with approx 'New' Base Prices (RM)
# These base prices help calculate a realistic resale value.
models_config = {
    'Honda': {
        'Civic': 130000, 'City': 90000, 'Accord': 180000, 'Jazz': 85000,
        'CR-V': 160000, 'HR-V': 115000, 'BR-V': 95000
    },
    'Toyota': {
        'Vios': 95000, 'Corolla': 130000, 'Camry': 200000, 'Yaris': 88000,
        'Hilux': 120000, 'Fortuner': 190000
    },
    'Nissan': {
        'Almera': 80000, 'Serena': 140000, 'X-Trail': 150000, 'Navara': 110000
    },
    'Mazda': {
        'Mazda2': 95000, 'Mazda3': 145000, 'Mazda6': 180000, 'CX-5': 160000
    },
    'Lexus': {
        'ES': 300000, 'IS': 250000, 'RX': 400000, 'NX': 350000
    }
}

# 2. Helper lists for random selection
conditions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
transmission_types = ['Automatic', 'CVT', 'Manual']
fuel_types = ['Petrol', 'Diesel', 'Hybrid']

# 3. Generator Function
def generate_malaysia_car_data(num_samples=2000):
    data = []

    for _ in range(num_samples):
        # Pick a random Brand
        brand = random.choice(list(models_config.keys()))
        # Pick a random Model from that Brand
        model = random.choice(list(models_config[brand].keys()))
        
        # Get Base Price
        base_price = models_config[brand][model]

        # Year of Manufacture (Weighted towards newer cars for market realism)
        year = random.choices(range(2014, 2025), weights=[1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10])[0]
        age = 2025 - year

        # Mileage Logic: Approx 15k - 25k km per year + random noise
        avg_annual_mileage = random.randint(12000, 28000)
        mileage = int(avg_annual_mileage * age) if age > 0 else random.randint(100, 5000)

        # Condition Logic: Correlated with Age/Mileage
        if age <= 2 and mileage < 40000:
            condition = 'Excellent'
        elif age <= 5 and mileage < 100000:
            condition = random.choice(['Very Good', 'Good'])
        elif age <= 8:
            condition = random.choice(['Good', 'Fair'])
        else:
            condition = random.choice(['Fair', 'Poor'])

        # Fuel & Transmission Logic (Heuristics)
        # Defaults
        fuel = 'Petrol'
        transmission = 'Automatic'
        
        # Specific adjustments
        if model in ['Hilux', 'Navara', 'Fortuner']:
            fuel = random.choice(['Diesel', 'Diesel', 'Petrol']) # Mostly Diesel
            transmission = random.choice(['Automatic', 'Manual'])
        elif model in ['City', 'Vios', 'Almera', 'Jazz', 'Civic', 'Corolla']:
             transmission = random.choice(['Automatic', 'CVT'])
        elif brand == 'Lexus' or model in ['Camry', 'Accord']:
            fuel = random.choice(['Petrol', 'Hybrid'])
            transmission = 'Automatic'

        # 4. Price Calculation (Depreciation Model)
        # Simple formula: Base * (0.9 ^ Age) * Mileage_Penalty * Condition_Factor
        depreciation_factor = 0.88 ** age # 12% depreciation per year
        
        # Mileage Penalty: -10% price for every 50k km (Increased from 5%)
        # WAS: mileage_penalty = 1 - (mileage / 1000000)
        mileage_penalty = 1 - (mileage / 500000) 
        
        # Condition Factor
        condition_map = {'Excellent': 1.1, 'Very Good': 1.05, 'Good': 1.0, 'Fair': 0.85, 'Poor': 0.7}
        condition_factor = condition_map[condition]

        # Calculate Price
        estimated_price = base_price * depreciation_factor * mileage_penalty * condition_factor
        
        # Add random market noise (+/- 5%)
        noise = random.uniform(0.95, 1.05)
        final_price = int(estimated_price * noise)

        # Ensure price doesn't drop below realistic scrap value or go negative
        final_price = max(final_price, 8000)

        # Append to list
        data.append([
            final_price, brand, model, year, mileage, condition, fuel, transmission
        ])

    # Create DataFrame
    columns = ['Resale Price (RM)', 'Brand Make', 'Model', 'Year of Manufacturer', 
               'Mileage (KM)', 'Condition', 'Petrol Type', 'Transmission Type']
    df = pd.DataFrame(data, columns=columns)
    return df

# Generate the dataset (100k rows)
df_cars = generate_malaysia_car_data(100000) 

# Display first 10 rows to verify
print("Dataset Preview:")
print(df_cars.head(10))

# Save to CSV
df_cars.to_csv('malaysia_used_cars_synthetic.csv', index=False)
print("\nCSV file 'malaysia_used_cars_synthetic.csv' saved successfully.")
