// Vasu: React DOM root setup aur StrictMode wrapper
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Vasu: App component aur styles import yahan se honge
import App from './App'
import './index.css'

// Adi: DS pipeline aur state App.jsx ke andar load hogi
// Vasu: Root DOM element pe React app mount karo
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
