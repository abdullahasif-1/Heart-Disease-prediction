import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

DATA_PATH = "heart-disease-prediction.csv"
MODEL_PATH = "heart_disease_model.pkl"

FEATURE_ORDER = [
    "male", "age", "currentSmoker", "cigsPerDay", "BPMeds",
    "prevalentStroke", "prevalentHyp", "diabetes", "totChol",
    "sysBP", "diaBP", "BMI", "heartRate", "glucose"
]

def train_model():
    df = pd.read_csv(DATA_PATH)

    # Impute missing values exactly like your script
    mean_education = df['education'].mean()
    df['education'] = df['education'].fillna(mean_education)

    df[['cigsPerDay', 'BPMeds', 'glucose']] = df[['cigsPerDay', 'BPMeds', 'glucose']].fillna(
        df[['cigsPerDay', 'BPMeds', 'glucose']].median()
    )
    df[['totChol', 'BMI', 'heartRate']] = df[['totChol', 'BMI', 'heartRate']].fillna(
        df[['totChol', 'BMI', 'heartRate']].mode().iloc[0]
    )

    # Drop education as before
    df.drop(columns=['education'], inplace=True)

    X = df.drop(['TenYearCHD'], axis=1)
    y = df['TenYearCHD']

    # Ensure feature order consistency
    X = X[FEATURE_ORDER]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("Model Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    joblib.dump({"model": model, "columns": FEATURE_ORDER}, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()