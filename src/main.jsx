import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter as Router} from 'react-router-dom';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router >
      <App />
    </Router>
  </StrictMode>,
)
