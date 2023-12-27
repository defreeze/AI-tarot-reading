import React, { useState, useEffect } from 'react';
import './App.css';
import Tarotgen from './components/tarotreading';
import { preloadImages } from './preloadImages';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AboutPage from './aboutPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [Value1, setPassword] = useState('');
  const Correct = process.env.REACT_APP_VALUE;
  const Value = process.env.REACT_APP_KEY;
  const CorrectValue = Correct + Value;
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState("");

  useEffect(() => {
    preloadImages();
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && Value1 === CorrectValue) {
      setIsAuthenticated(true);
    }
  };


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/" element={
            <>
              {/* Main Content */}

              {choice === "1" || choice === "2" ? (
                <>
                  <img src="/AI_tarot_final1_wise_woman2.png" alt="AI Tarot" className="bottom-right-image-woman" />
                  {/*<img src="/AI_tarot_final1_wise_woman_animation.png" alt="AI_female_animate" className="AI-woman-animate" />*/}
                  <img src="/AI_tarot_final1_wise_woman_animation2.png" alt="AI_female_animate" className="AI-woman-animate2" />

                  <div className="center-container">
                    <img src="/spell-visual1.png" alt="loading_female_animate" className={`loading-visual-female ${loading ? '' : 'hidden'}`} />
                  </div>

                </>
              ) : choice === "3" || choice === "4" ? (
                <>
                  <img src="/AI_tarot_final1_female.png" alt="AI Tarot" className="bottom-right-image-female" />
                  <img src="/AI_tarot_final1_female_animation.png" alt="AI_female_animate" className="AI-female-animate" />
                  <div className="center-container">
                    <img src="/spell-visual1.png" alt="loading_female_animate" className={`loading-visual-female ${loading ? '' : 'hidden'}`} />
                  </div>
                </>
              ) : choice === "" || choice === "5" || choice === "6" ? (
                <>
                  <img src="/AI_tarot_final1.png" alt="AI Tarot" className="bottom-right-image" />
                  <img src="/AI_tarot_final1_purple.png" alt="Loading" className={`loading-image ${loading ? '' : 'hidden'}`} />
                  <img src="/tarotstar2.png" alt="Tarot Star" className="tarot-star" />
                </>
              ) : []
              }
              <header className="App-header">
                <div className="header-buttons">
                  <Link to="/about" >
                    <button className="header-button">About</button>

                  </Link>
                </div>

                <Tarotgen
                  setIsAuthenticated={setIsAuthenticated}
                  setLoading={setLoading}
                  choice={choice}
                  setChoice={setChoice}
                  loading={loading}
                />
              </header>
              <footer className="App-footer">
                made by <a href="https://www.alexdevri.es" target="_blank" rel="noopener noreferrer">alexdevri.es</a>
              </footer>

              {/* Password Overlay */}
              {!isAuthenticated && (
                <div className="password-overlay">
                  <input
                    type="password"
                    placeholder="Enter Password..."
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
              )} </>
          } />
        </Routes>
      </div >
    </Router>
  );
}

export default App;