import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// see and understand the frontend part 
createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
