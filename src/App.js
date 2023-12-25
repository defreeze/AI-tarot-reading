import React, { useState } from 'react';
import './App.css';
import Tarotgen from './components/tarotreading';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [Value1, setPassword] = useState('');
  const Correct = process.env.REACT_APP_VALUE;
  const Value = process.env.REACT_APP_KEY;
  const CorrectValue = Correct + Value;

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && Value1 === CorrectValue) {
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="App">
      {/* Main Content */}
      <div className="img-container">
        <img src="/AI_tarot_final1.png" alt="AI Tarot" className="bottom-right-image" />
        <img src="/tarotstar2.png" alt="Tarot Star" className="tarot-star" />
      </div>
      <header className="App-header">
        <Tarotgen setIsAuthenticated={setIsAuthenticated} />
      </header>
      <footer className="App-footer">
        made by <a href="https://www.alexdevri.es" target="_blank" rel="noopener noreferrer">alexdevri.es</a>
      </footer>

      {/* Password Overlay */}
      {!isAuthenticated && (
        <div className="password-overlay">

          <input
            type="password"
            placeholder="Enter Password.."
            value={Value1}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            className="password-input"
          />
          <p className="password-info">
            ask for a password at&nbsp;
            <a href="https://alexdevri.es/contact/" target="_blank" rel="noopener noreferrer">
              www.alexdevri.es
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
