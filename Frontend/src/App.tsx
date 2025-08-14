import React, { useState } from 'react'
import { predict, type CHDInput, type CHDOutput } from './api'

const initial: CHDInput = {
  male: 1, age: 32, currentSmoker: 0, cigsPerDay: 0, BPMeds: 0,
  prevalentStroke: 0, prevalentHyp: 0, diabetes: 0, totChol: 170,
  sysBP: 120, diaBP: 80, BMI: 24, heartRate: 70, glucose: 90,
}

export default function App() {
  const [form, setForm] = useState<CHDInput>(initial)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CHDOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onNumChange = (key: keyof CHDInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value === '' ? '' : Number(e.target.value) as any }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload: CHDInput = { ...form,
        male: Number(form.male), currentSmoker: Number(form.currentSmoker), BPMeds: Number(form.BPMeds),
        prevalentStroke: Number(form.prevalentStroke), prevalentHyp: Number(form.prevalentHyp), diabetes: Number(form.diabetes),
      }
      const data = await predict(payload)
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fields: Array<{ key: keyof CHDInput; label: string; step?: number; min?: number; max?: number }> = [
    { key: 'male', label: 'Gender (1=Male,0=Female)', min:0,max:1,step:1 }, { key:'age', label:'Age', step:0.1 },
    { key:'currentSmoker', label:'Current Smoker (1/0)', min:0,max:1,step:1 }, { key:'cigsPerDay', label:'Cigarettes/day', step:1 },
    { key:'BPMeds', label:'BP Meds (1/0)', min:0,max:1,step:1 }, { key:'prevalentStroke', label:'Prevalent Stroke (1/0)', min:0,max:1,step:1 },
    { key:'prevalentHyp', label:'Prevalent Hypertension (1/0)', min:0,max:1,step:1 }, { key:'diabetes', label:'Diabetes (1/0)', min:0,max:1,step:1 },
    { key:'totChol', label:'Total Cholesterol', step:1 }, { key:'sysBP', label:'Systolic BP', step:1 },
    { key:'diaBP', label:'Diastolic BP', step:1 }, { key:'BMI', label:'BMI', step:0.1 },
    { key:'heartRate', label:'Heart Rate', step:1 }, { key:'glucose', label:'Glucose', step:1 },
  ]

  return (
    <div style={{maxWidth:820,margin:'40px auto',fontFamily:'Inter,system-ui,Arial'}}>
      <h1>CHD Risk Predictor</h1>
      <p>Enter patient details to predict 10‑year CHD risk.</p>
      <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {fields.map(f => (
          <label key={f.key.toString()} style={{display:'grid',gap:6}}>
            <span>{f.label}</span>
            <input type='number' required step={f.step ?? 1} min={f.min} max={f.max} value={form[f.key] as number} onChange={onNumChange(f.key)} style={{padding:8,border:'1px solid #ccc',borderRadius:8}} />
          </label>
        ))}
        <div style={{gridColumn:'1/-1',display:'flex',gap:12,alignItems:'center'}}>
          <button disabled={loading} style={{padding:'10px 16px',borderRadius:10,border:'none',background:'#111',color:'#fff'}}>{loading ? 'Predicting…':'Predict'}</button>
          {error && <span style={{color:'crimson'}}>Error: {error}</span>}
        </div>
      </form>
      {result && (
        <div style={{marginTop:24,padding:16,border:'1px solid #eee',borderRadius:12}}>
          <h2>Result</h2>
          <p><strong>{result.message}</strong></p>
          <p>Probability (positive class): <strong>{(result.probability*100).toFixed(2)}%</strong></p>
        </div>
      )}
    </div>
  )
}