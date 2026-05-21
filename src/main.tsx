import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.js'
import { Provider } from 'react-redux'
import store from './app/store' 
import { BrowserRouter } from 'react-router-dom'
import { startAuthListener } from './features/auth/authListener'
startAuthListener(store.dispatch);
createRoot(document.getElementById('root')!).render(<StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
