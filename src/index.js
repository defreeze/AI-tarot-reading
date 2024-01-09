import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create the root once with the container element
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Render the app inside the root without specifying the container again
root.render(
  <GoogleOAuthProvider clientId="619587058121-qunfd2tpdn3ntvcgm2l66puq5a65rq0t.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// Performance reporting
reportWebVitals();
