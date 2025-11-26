import joblib
import pandas as pd
import os
import numpy as np

# Mock settings
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'strada_model.joblib')

def generate_explanation(model_pipeline, input_data):
    # 1. Access steps
    regressor = model_pipeline.named_steps['regressor']
    preprocessor = model_pipeline.named_steps['preprocessor']
    
    # 2. Get Scaler info
    scaler = preprocessor.named_transformers_['num']['scaler']
    scaler_mean = scaler.mean_
    scaler_scale = scaler.scale_
    numeric_features = ['age', 'mileage_km']
    
    # 3. Get Categorical info
    ohe = preprocessor.named_transformers_['cat']['onehot']
    categorical_features = ['make', 'model', 'condition', 'transmission', 'fuel_type']
    ohe_categories = ohe.categories_
    
    # 4. Get Coefficients
    coefs = regressor.coef_
    intercept = regressor.intercept_
    
    # Map coefficients to features
    # Order: Numeric (2) + Categorical (Many)
    # We need to get the feature names from OHE to match them correctly
    ohe_feature_names = ohe.get_feature_names_out(categorical_features)
    all_feature_names = numeric_features + list(ohe_feature_names)
    
    coef_dict = dict(zip(all_feature_names, coefs))
    
    explanation = []
    
    # Base Price (Intercept) - this is the price if all numeric features were at their mean and no categorical features were active (which is impossible for OHE usually, but conceptually valid)
    # Actually, for OHE, the intercept includes the effect of the dropped category if drop='first', but here drop=None (default).
    # With Ridge and no drop, the intercept is centered.
    
    explanation.append(f"Base Price: RM {intercept:.2f}")
    
    # Numeric Contributions
    for i, feature in enumerate(numeric_features):
        val = input_data[feature]
        mean = scaler_mean[i]
        scale = scaler_scale[i]
        scaled_val = (val - mean) / scale
        contribution = coef_dict[feature] * scaled_val
        explanation.append(f"{feature} ({val}): RM {contribution:.2f}")

    # Categorical Contributions
    for feature in categorical_features:
        val = input_data[feature]
        # Construct the OHE feature name
        # OHE usually formats as "col_val"
        # Check how get_feature_names_out formats it
        # It usually does "col_val"
        
        # We need to find the matching feature name
        # But wait, input_data has raw values.
        # We need to check which OHE feature corresponds to this raw value.
        
        # Simple way:
        target_col = f"{feature}_{val}"
        if target_col in coef_dict:
            contribution = coef_dict[target_col]
            explanation.append(f"{feature} ({val}): RM {contribution:.2f}")
        else:
            explanation.append(f"{feature} ({val}): RM 0.00 (Unknown or Reference)")
            
    return explanation

if __name__ == "__main__":
    if not os.path.exists(MODEL_PATH):
        print(f"Model not found at {MODEL_PATH}")
        exit()
        
    print("Loading model...")
    model = joblib.load(MODEL_PATH)
    
    # Mock Input
    input_data = {
        'age': 5,
        'mileage_km': 80000,
        'make': 'Honda',
        'model': 'Civic',
        'condition': 'Good',
        'transmission': 'Automatic',
        'fuel_type': 'Petrol'
    }
    
    print("Generating explanation...")
    try:
        explanations = generate_explanation(model, input_data)
        for line in explanations:
            print(line)
            
        # Verify total
        input_df = pd.DataFrame([input_data])
        prediction = model.predict(input_df)[0]
        print(f"\nPredicted Price: RM {prediction:.2f}")
        
        # Sum of parts check
        # Note: Sum of parts should equal (Prediction - Intercept) ? 
        # Actually: Prediction = Intercept + Sum(Contributions)
        # Let's verify this.
        
        total_contribution = 0
        intercept_val = 0
        for line in explanations:
            if "Base Price" in line:
                intercept_val = float(line.split("RM ")[1])
            else:
                total_contribution += float(line.split("RM ")[1])
                
        calculated = intercept_val + total_contribution
        print(f"Calculated from explanation: RM {calculated:.2f}")
        print(f"Difference: {abs(prediction - calculated):.4f}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
