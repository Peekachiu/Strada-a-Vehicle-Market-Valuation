import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, KFold
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures
from sklearn.linear_model import Ridge
from sklearn.compose import TransformedTargetRegressor
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.preprocessing import OrdinalEncoder

# 1. Load Data
# Using the clean master dataset (no scraped noise)
df = pd.read_csv('datasets/malaysia_master_dataset.csv')

# 2. Feature Engineering (Same as best model)
df['age'] = 2025 - df['year']
X = df[['age', 'mileage_km', 'make', 'model', 'condition', 'transmission', 'fuel_type']]
y = df['price_rm']

# 3. Define Preprocessors
numeric_features = ['age', 'mileage_km']
categorical_features = ['make', 'model', 'condition', 'transmission', 'fuel_type']

# A. Ridge Pipeline components
numeric_transformer_poly = Pipeline(steps=[
    ('scaler', StandardScaler()),
    ('poly', PolynomialFeatures(include_bias=False)) 
])

categorical_transformer_ohe = Pipeline(steps=[
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor_ridge = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer_poly, numeric_features),
        ('cat', categorical_transformer_ohe, categorical_features)
    ])

# B. HistGradientBoosting Pipeline components
# Trees don't need scaling or poly features usually, but they need Ordinal Encoding
categorical_transformer_ord = Pipeline(steps=[
    ('ordinal', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1))
])

preprocessor_tree = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numeric_features),
        ('cat', categorical_transformer_ord, categorical_features)
    ])

# 4. Search Space Definition

# Model A: Polynomial Ridge (Current Best)
param_grid_ridge = {
    'regressor__regressor__alpha': [0.1, 0.5, 1.0, 5.0, 10.0],
    'regressor__transformer__num__poly__degree': [2, 3] # Try degree 3?
}

full_pipeline_ridge = Pipeline(steps=[
    ('preprocessor', preprocessor_ridge),
    ('regressor', Ridge())
])

# Log-Transform Wrapper
# Note: When using TransformedTargetRegressor, usually the internal regressor is accessible via 'regressor'
# So parameter names become 'regressor__regressor__param'
model_ridge = TransformedTargetRegressor(regressor=full_pipeline_ridge, func=np.log1p, inverse_func=np.expm1)


# Model B: HistGradientBoosting (Potential Challenger)
param_grid_tree = {
    'regressor__regressor__learning_rate': [0.01, 0.05, 0.1, 0.2],
    'regressor__regressor__max_iter': [100, 200, 500],
    'regressor__regressor__max_depth': [None, 10, 20],
    'regressor__regressor__l2_regularization': [0, 0.1, 1.0]
}

full_pipeline_tree = Pipeline(steps=[
    ('preprocessor', preprocessor_tree),
    ('regressor', HistGradientBoostingRegressor(random_state=42))
])

model_tree = TransformedTargetRegressor(regressor=full_pipeline_tree, func=np.log1p, inverse_func=np.expm1)

# 5. Run Grid Search
print("--- [Starting Hyperparameter Optimization] ---")
cv = KFold(n_splits=5, shuffle=True, random_state=42)

# Test Ridge
print("\nOptimizing Polynomial Ridge...")
# Note: Param grid keys need to match the nested structure of TransformedTargetRegressor -> Pipeline
# TTR wraps the pipeline. TTR param name is 'regressor'.
# Pipeline steps are 'preprocessor' and 'regressor'.
# Included Ridge is 'regressor'.
# So path: regressor (Pipeline) -> regressor (Ridge) -> alpha
# Wait, Pipeline is: preprocessor, regressor(Ridge).
# So TTR.regressor IS the Pipeline.
# Pipeline.regressor IS the Ridge model.
# So param key: 'regressor__regressor__alpha' is correct.
# BUT Poly features is inside 'preprocessor'.
# Path: regressor(Pipeline) -> preprocessor(ColumnTransformer) -> num(Pipeline) -> poly(PolynomialFeatures) -> degree
# Key: 'regressor__preprocessor__num__poly__degree'

real_param_grid_ridge = {
    'regressor__regressor__alpha': [0.1, 0.5, 1.0, 5.0],
    'regressor__preprocessor__num__poly__degree': [2, 3]
}

search_ridge = GridSearchCV(model_ridge, real_param_grid_ridge, cv=cv, scoring='r2', n_jobs=-1, verbose=1)
search_ridge.fit(X, y)
print(f"Best Ridge R2: {search_ridge.best_score_:.4f}")
print(f"Best Ridge Params: {search_ridge.best_params_}")

# Test HistGB
print("\nOptimizing HistGradientBoosting...")
real_param_grid_tree = {
    'regressor__regressor__learning_rate': [0.1, 0.2], # Keep small for speed
    'regressor__regressor__max_iter': [100, 300],
    'regressor__regressor__max_leaf_nodes': [31, 50, 100]
}

search_tree = GridSearchCV(model_tree, real_param_grid_tree, cv=cv, scoring='r2', n_jobs=-1, verbose=1)
search_tree.fit(X, y)
print(f"Best HistGB R2: {search_tree.best_score_:.4f}")
print(f"Best HistGB Params: {search_tree.best_params_}")
