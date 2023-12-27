import React, { useState, useEffect } from 'react';
import './App.css';
import Tarotgen from './components/tarotreading';
import { preloadImages } from './preloadImages';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AboutPage from './aboutPage';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [Value1, setPassword] = useState('');
  const Correct = process.env.REACT_APP_VALUE;
  const Value = process.env.REACT_APP_KEY;
  const CorrectValue = Correct + Value;
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState("");

  const [showPasswordPage, setShowPasswordPage] = useState(false);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState(null);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });
  const logOut = () => {
    googleLogout();
    setProfile(null);
    setShowPasswordPage(false);
    // Additional logic for logout
  };

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

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
          <Route path="/about" element={<AboutPage profile={profile} login={login} logOut={logOut} />} />
          <Route path="/" element={
            <>
              {/* Main Content */}
              {/* 
              {profile ? (
                <div>
                  <img src={profile.picture} alt="User" />
                  <p>{profile.name}</p>
                  <button onClick={logOut}>Log out</button>
                </div>
              ) : (
                <button onClick={() => login()}>Sign in with Google</button>
              )}*/}
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
                  {profile ? (
                    <>
                      <span className="profile-name">welcome {profile.name}! </span>
                      <button className="header-button-google" onClick={() => logOut()}>
                        <img src="web_neutral_sq_na@1x.png" alt="Google" className="google-logo" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button className="header-button-google" onClick={() => login()}>
                      <img src="web_neutral_sq_na@1x.png" alt="Google" className="google-logo" />
                      Sign in with Google
                    </button>)}
                  <Link to="/about" className="header-link">
                    <button className="header-button">About</button>
                  </Link>
                </div>

                <Tarotgen
                  profile={profile}
                  setLoading={setLoading}
                  choice={choice}
                  setChoice={setChoice}
                  loading={loading}
                  showPasswordPage={showPasswordPage}
                  setShowPasswordPage={setShowPasswordPage}
                />
              </header>
              <footer className="App-footer">
                made by <a href="https://www.alexdevri.es" target="_blank" rel="noopener noreferrer">alexdevri.es</a>
              </footer>

              {/* Password Overlay */}
              {!profile && showPasswordPage && (
                <div className="password-overlay">
                  <button className="header-button-google" onClick={() => login()}>
                    <img src="web_neutral_sq_na@1x.png" alt="Google" className="google-logo" />
                    Sign in with Google
                  </button>
                  <p className="password-info">
                    AI costs money, log in to get 1 free reading a day! <br />
                    <a href="https://www.buymeacoffee.com/alexdevries" target="_blank" rel="noopener noreferrer">
                      ☕ buy me a coffee ☕
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
