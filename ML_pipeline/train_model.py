import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
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

print(f"Data loaded. {len(df)} records found.")

# --- 2. Feature Engineering ---
df['age'] = 2025 - df['year']
print("Feature Engineering: 'age' column created.")

# --- 3. Define Features (X) and Target (y) ---
target = 'price_rm'
numeric_features = ['age', 'mileage_km']
categorical_features = ['make', 'model', 'condition', 'transmission', 'fuel_type']

X = df[numeric_features + categorical_features]
y = df[target]

print("Features (X) and Target (y) are defined.")

# --- 4. Split Data ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Data split: {len(X_train)} training records, {len(X_test)} testing records.")

# --- 5. Create Preprocessing Pipelines ---
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
print("Preprocessing pipelines created.")

# --- 6. Define the Model Pipeline ---
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(random_state=42, n_jobs=-1))
])

# --- 7. NEW: Define the Hyperparameter Grid ---
# Testing 3 (n_estimators) x 2 (max_depth) = 6 combinations
param_grid = {
    'regressor__n_estimators': [100, 200, 300],  # How many "trees" to build
    'regressor__max_depth': [None, 10]          # How "deep" each tree can be (None = as deep as possible)
}

# --- 8. NEW: Create and Run the Grid Search ---
# This will automatically test all 6 combinations using 3-fold cross-validation
# cv=3 means it splits the training data into 3 parts to check its work
# n_jobs=-1 means it will use all your computer's cores
grid_search = GridSearchCV(
    pipeline, 
    param_grid, 
    cv=3, 
    n_jobs=-1, 
    scoring='r2',
    verbose=2
)

print("\n--- [Starting Hyperparameter Tuning] ---")
print("This will take several minutes...")
grid_search.fit(X_train, y_train)
print("--- [Tuning Complete] ---")

# --- 9. Evaluate the BEST Model ---
print("\nBest settings found by Grid Search:")
print(grid_search.best_params_)

# 'grid_search.best_estimator_' is the *best* model it found
best_model = grid_search.best_estimator_
score = best_model.score(X_test, y_test)

print(f"\nModel Evaluation (R-squared score): {score:.4f}")
print(f"(Model explains {score*100:.1f}% of the price variation.)")

# --- 10. Save the BEST Model ---
joblib.dump(best_model, MODEL_FILE)

print(f"\n--- [SUCCESS!] ---")
print(f"The *best* model pipeline has been saved to:")
print(f"==> {MODEL_FILE} <==")