import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EstruturaApp from './EstruturaApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EstruturaApp />
  </StrictMode>,
)
