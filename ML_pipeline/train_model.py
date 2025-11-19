import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import Ridge 
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

# --- 1. Define File Paths ---
DATA_FILE = 'datasets/malaysia_master_dataset.csv'
MODEL_FILE = 'ml_pipeline/strada_model.joblib'

print(f"Loading data from '{DATA_FILE}'...")
try:
    df = pd.read_csv(DATA_FILE)
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
numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])
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

# --- 6. Define Model (Ridge) ---
model = Ridge(alpha=1.0)

# --- 7. Create Pipeline ---
final_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', model)
])

print("\n--- [Training Linear Model] ---")
final_pipeline.fit(X_train, y_train)
print("--- [Training Complete] ---")

# --- 8. Evaluate ---
score = final_pipeline.score(X_test, y_test)
print(f"\nModel Evaluation (R-squared score): {score:.4f}")

# --- 9. Save ---
joblib.dump(final_pipeline, MODEL_FILE)

# --- 10. NEW: INSPECT THE MATH ---
# Let's look at the coefficients to prove the model respects mileage/age
print("\n--- [Model Logic Proof] ---")
# Access the trained model inside the pipeline
trained_model = final_pipeline.named_steps['regressor']
# Get feature names from preprocessor
feature_names_num = numeric_features
feature_names_cat = final_pipeline.named_steps['preprocessor'].named_transformers_['cat']['onehot'].get_feature_names_out(categorical_features)
all_features = list(feature_names_num) + list(feature_names_cat)

# Create a dictionary of Feature -> Coefficient
coefs = pd.Series(trained_model.coef_, index=all_features)

# We need to un-scale the numeric coefficients to make them readable in RM
# (Because we used StandardScaler, the raw coefficients are for "Standard Deviations", not "KM")
# This is a rough approximation for display purposes:
scaler = final_pipeline.named_steps['preprocessor'].named_transformers_['num']['scaler']
mileage_scale = scaler.scale_[1] # Scale factor for mileage
age_scale = scaler.scale_[0]     # Scale factor for age

print(f"Impact of Mileage: For every 10,000 km added, Price drops by approx RM {abs(coefs['mileage_km'] / mileage_scale * 10000):.2f}")
print(f"Impact of Age:     For every 1 year older, Price drops by approx RM {abs(coefs['age'] / age_scale):.2f}")
print("---------------------------")