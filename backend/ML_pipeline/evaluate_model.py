import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import os

# Define Paths
DATA_FILE = 'backend/ML_pipeline/malaysia_used_cars_synthetic.csv'
MODEL_FILE = 'backend/ML_pipeline/strada_model.joblib'
ARTIFACTS_DIR = r'C:\Users\Edwin Neoh\.gemini\antigravity\brain\0344dd56-7b65-4483-9641-ed52e77322d7'

def evaluate_model():
    print("Loading data and model...")
    try:
        # Load Data
        df = pd.read_csv(DATA_FILE)
        
        # Rename columns to match training
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

        # Feature Engineering (Age)
        df['age'] = 2025 - df['year']

        # Define Features & Target
        target = 'price_rm'
        numeric_features = ['age', 'mileage_km']
        categorical_features = ['make', 'model', 'condition', 'transmission', 'fuel_type']
        
        X = df[numeric_features + categorical_features]
        y = df[target]

        # Split Data (MUST use same random_state as training to evaluate on unseen data if possible,
        # but here we just want a valid test set. ideally we would have saved the test set separately)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Load Model
        model = joblib.load(MODEL_FILE)
        
    except Exception as e:
        print(f"Error loading resources: {e}")
        return

    print("Running predictions on test set...")
    y_pred = model.predict(X_test)

    # --- 1. Metrics ---
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print(f"\n--- Model Performance Metrics ---")
    print(f"R-squared Score: {r2:.4f}")
    print(f"Mean Absolute Error (MAE): RM {mae:,.2f}")
    print(f"Root Mean Squared Error (RMSE): RM {rmse:,.2f}")

    # --- 2. Visualizations ---
    sns.set_theme(style="whitegrid")

    # Plot A: Actual vs Predicted
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred, alpha=0.3, color='blue')
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2) # Ideal line
    plt.xlabel('Actual Price (RM)')
    plt.ylabel('Predicted Price (RM)')
    plt.title(f'Actual vs Predicted Prices (R2 = {r2:.2f})')
    plt.tight_layout()
    plt.savefig(os.path.join(ARTIFACTS_DIR, 'actual_vs_predicted.png'))
    print("Saved actual_vs_predicted.png")
    plt.close()

    # Plot B: Residuals (Error Distribution)
    residuals = y_test - y_pred
    plt.figure(figsize=(10, 6))
    sns.histplot(residuals, kde=True, color='purple')
    plt.xlabel('Prediction Error (RM)')
    plt.title('Distribution of Prediction Errors (Residuals)')
    plt.tight_layout()
    plt.savefig(os.path.join(ARTIFACTS_DIR, 'residuals_histogram.png'))
    print("Saved residuals_histogram.png")
    plt.close()

    # --- 3. Sample CSV ---
    results_df = pd.DataFrame({
        'Actual': y_test,
        'Predicted': y_pred.round(2),
        'Difference': residuals.round(2)
    }).head(20) # Top 20 rows
    
    csv_path = os.path.join(ARTIFACTS_DIR, 'predictions_sample.csv')
    results_df.to_csv(csv_path)
    print(f"Saved predictions_sample.csv to {csv_path}")

if __name__ == "__main__":
    evaluate_model()
