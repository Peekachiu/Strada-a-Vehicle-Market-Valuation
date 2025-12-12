import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import Ridge 
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

# --- 1. Define File Paths ---
DATA_FILE = 'ML_pipeline/malaysia_used_cars_synthetic.csv'
MODEL_FILE = 'ML_pipeline/strada_model.joblib'

print(f"Loading data from '{DATA_FILE}'...")
try:
    df = pd.read_csv(DATA_FILE)
    
    # Rename columns to match the expected feature names
    df = df.rename(columns={
        'Resale Price (RM)': 'price_rm',
        'Brand Make': 'make',
        'Model': 'model',
        'Year of Manufacturer': 'year',
        'Mileage (KM)': 'mileage_km',
        'Condition': 'condition',
        'Petrol Type': 'fuel_type',
        'Transmission Type': 'transmission'
    })
    
except FileNotFoundError:
    print(f"Error: '{DATA_FILE}' not found.")
    exit()

# --- 2. Feature Engineering ---
df['age'] = 2025 - df['year']

# --- 3. Define Features ---
target = 'price_rm'
numeric_features = ['age', 'mileage_km']
categorical_features = ['make', 'model', 'condition', 'transmission', 'fuel_type']

X = df[numeric_features + categorical_features]
y = df[target]

# --- 4. Split Data ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- 5. Preprocessing ---
numeric_transformer = Pipeline(steps=[
    ('scaler', StandardScaler()),
    ('poly', PolynomialFeatures(degree=2, include_bias=False))
])

categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ],
    remainder='passthrough'
)

# --- 6. Define Model (Ridge with Log-Target) ---
# We use TransformedTargetRegressor to handle the log-transform automatically
from sklearn.compose import TransformedTargetRegressor
import numpy as np

# Optimized Params from GridSearchCV: alpha=0.1
model_base = Ridge(alpha=0.1)

# --- 7. Create Pipeline ---
final_pipeline_inner = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', model_base)
])

final_pipeline = TransformedTargetRegressor(
    regressor=final_pipeline_inner,
    func=np.log1p,
    inverse_func=np.expm1
)

print("\n--- [Training Improved Model (Poly+Ridge+Log)] ---")
final_pipeline.fit(X_train, y_train)
print("--- [Training Complete] ---")

# --- 8. Evaluate ---
score = final_pipeline.score(X_test, y_test)
print(f"\nModel Evaluation (R-squared score): {score:.4f}")

# --- 9. Save ---
joblib.dump(final_pipeline, MODEL_FILE)
print(f"Model saved to {MODEL_FILE}")

# --- 10. Model Behavior Validation (What-If Analysis) ---
def validate_model_behavior(pipeline):
    print("\n--- [Model Behavior Validation Report] ---")
    print("Baseline Car: 2020 Honda City, 50,000km, Good Condition, Petrol, Automatic")
    
    # Define Baseline
    baseline_data = {
        'make': ['Honda'], 'model': ['City'], 'year': [2020], 
        'mileage_km': [50000], 'condition': ['Good'], 
        'fuel_type': ['Petrol'], 'transmission': ['Automatic']
    }
    
    # Helper to predict
    def get_price(data_dict):
        df = pd.DataFrame(data_dict)
        df['age'] = 2025 - df['year']
        return pipeline.predict(df)[0]

    base_price = get_price(baseline_data)
    print(f"Baseline Price: RM {base_price:,.2f}")
    
    # 1. Year Impact
    print("\n1. Impact of Year (Depreciation):")
    for y_chk in [2024, 2022, 2020, 2015, 2010]:
        test_data = baseline_data.copy()
        test_data['year'] = [y_chk]
        price = get_price(test_data)
        diff = price - base_price
        print(f"   Year {y_chk}: RM {price:,.2f} ({diff:+,.2f} vs Baseline)")

    # 2. Mileage Impact
    print("\n2. Impact of Mileage:")
    for m_chk in [10000, 50000, 100000, 200000]:
        test_data = baseline_data.copy()
        test_data['mileage_km'] = [m_chk]
        price = get_price(test_data)
        diff = price - base_price
        print(f"   {m_chk:,} km: RM {price:,.2f} ({diff:+,.2f} vs Baseline)")
        
    # 3. Condition Impact
    print("\n3. Impact of Condition:")
    for c_chk in ['Excellent', 'Good', 'Fair', 'Poor']:
        test_data = baseline_data.copy()
        test_data['condition'] = [c_chk]
        price = get_price(test_data)
        diff = price - base_price
        print(f"   {c_chk}: RM {price:,.2f} ({diff:+,.2f} vs Baseline)")

    # 4. Transmission Impact
    print("\n4. Impact of Transmission:")
    for t_chk in ['Automatic', 'Manual', 'CVT']:
        test_data = baseline_data.copy()
        test_data['transmission'] = [t_chk]
        price = get_price(test_data)
        diff = price - base_price
        print(f"   {t_chk}: RM {price:,.2f} ({diff:+,.2f} vs Baseline)")
        
    # 5. Fuel Impact
    print("\n5. Impact of Fuel Type:")
    for f_chk in ['Petrol', 'Hybrid', 'Diesel']:
        test_data = baseline_data.copy()
        test_data['fuel_type'] = [f_chk]
        price = get_price(test_data)
        diff = price - base_price
        print(f"   {f_chk}: RM {price:,.2f} ({diff:+,.2f} vs Baseline)")

validate_model_behavior(final_pipeline)
