export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type CHDInput = {
  male: number;
  age: number;
  currentSmoker: number;
  cigsPerDay: number;
  BPMeds: number;
  prevalentStroke: number;
  prevalentHyp: number;
  diabetes: number;
  totChol: number;
  sysBP: number;
  diaBP: number;
  BMI: number;
  heartRate: number;
  glucose: number;
};

export type CHDOutput = {
  prediction: number;
  probability: number;
  message: string;
};

export async function predict(input: CHDInput): Promise<CHDOutput> {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}