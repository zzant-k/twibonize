import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { setupPillInteractions } from './lib/pillInteractions'

// Initialize Obsidian Pill & Card dynamic cursor tracking & haptic click
setupPillInteractions()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

