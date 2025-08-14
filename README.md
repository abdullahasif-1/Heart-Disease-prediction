# CHD Risk Predictor

A web application that predicts the **10-year risk of coronary heart disease (CHD)** using a machine learning model.  
The backend is powered by **FastAPI**, and the frontend is built with **React + TypeScript**.

---

## Project Structure

chd-app/
├─ backend/
│ ├─ app.py # FastAPI backend API
│ ├─ train.py # Train ML model
│ ├─ heart-disease-prediction.csv # Dataset (not included in repo)
│ └─ requirements.txt
└─ frontend/
├─ src/
│ ├─ App.tsx # React form & results display
│ └─ api.ts # API requests
├─ package.json
└─ vite.config.ts

Backend 

python -m venv .venv
.venv\Scripts\Activate.ps1

pip install -r requirements.txt

Train the ML model
python train.py

uvicorn app:app --reload --port 8000

Frontend Setup (React + Vite)

cd Frontend

npm install
npm run dev




