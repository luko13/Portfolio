import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/shippori-mincho-b1/700.css'
import '@fontsource/shippori-mincho-b1/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
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
