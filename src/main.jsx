// src/main.jsx or src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { AuthProvider } from './Components/contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* AuthProvider should be here, outside BrowserRouter */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);