import React, { useState } from 'react';
import './App.css';
import Tarotgen from './components/tarotreading';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      <header className="App-header">
        <Tarotgen />
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
        </div>
      )}
    </div>
  );
}

export default App;
