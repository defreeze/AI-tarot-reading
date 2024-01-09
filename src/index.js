import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReCAPTCHA from 'react-google-recaptcha';

// Create the root once with the container element
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Define a function to handle reCAPTCHA changes
function onChange(value) {
  console.log("Captcha value:", value);
}

// Render the app inside the root without specifying the container again
root.render(
  <GoogleOAuthProvider clientId="619587058121-qunfd2tpdn3ntvcgm2l66puq5a65rq0t.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
      <ReCAPTCHA
        sitekey="6LfMzUopAAAAANeVgFTynsOpp1a_LXINKT3TxUqK"
        onChange={onChange}
      />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// Performance reporting
reportWebVitals();
