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
DATA_FILE = 'malaysia_master_dataset.csv'
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

model_base = Ridge(alpha=1.0)

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
