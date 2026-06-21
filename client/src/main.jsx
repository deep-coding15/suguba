import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from "./router.jsx"
import "./utils/i18n.js";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter/>
  </StrictMode>
)
