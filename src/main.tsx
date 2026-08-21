import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Solo subsets latin: el CSS completo de Shippori arrastra decenas de
// subsets japoneses y era el mayor bloqueo de render en móvil
import '@fontsource/shippori-mincho-b1/latin-700.css'
import '@fontsource/shippori-mincho-b1/latin-800.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/utils.css'
import './styles/sections.css'
import './motion/gsap'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
