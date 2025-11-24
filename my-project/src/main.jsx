import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css' // Importamos tus estilos
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)