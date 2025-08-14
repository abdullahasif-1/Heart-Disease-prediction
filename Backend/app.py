from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "heart_disease_model.pkl")

app = FastAPI(title="CHD Risk API", version="1.0.0")

# CORS (allow all during dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CHDInput(BaseModel):
    male: int = Field(..., ge=0, le=1)
    age: float
    currentSmoker: int = Field(..., ge=0, le=1)
    cigsPerDay: float
    BPMeds: int = Field(..., ge=0, le=1)
    prevalentStroke: int = Field(..., ge=0, le=1)
    prevalentHyp: int = Field(..., ge=0, le=1)
    diabetes: int = Field(..., ge=0, le=1)
    totChol: float
    sysBP: float
    diaBP: float
    BMI: float
    heartRate: float
    glucose: float

class CHDOutput(BaseModel):
    prediction: int
    probability: float
    message: str

# Load once at startup
saved = joblib.load(MODEL_PATH)
model = saved["model"]
columns = saved["columns"]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=CHDOutput)
def predict(payload: CHDInput):
    try:
        row = pd.DataFrame([payload.model_dump()], columns=columns)
        pred = int(model.predict(row)[0])
        proba = float(model.predict_proba(row)[0, 1])
        msg = (
            "High risk of coronary heart disease in the next 10 years"
            if pred == 1 else
            "Not high risk of coronary heart disease in the next 10 years"
        )
        return {"prediction": pred, "probability": round(proba, 4), "message": msg}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))