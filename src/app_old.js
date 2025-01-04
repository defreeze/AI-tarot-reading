import React, { useState, useEffect } from 'react';
import './App.css';
import Tarotgen from './components/tarotreading';
import { preloadImages } from './preloadImages';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutPage from './aboutPage';
import AccountPage from './AccountPage';

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebaseConfig'; 

import './firebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';


function App() {
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState("");
  const [showPasswordPage, setShowPasswordPage] = useState(false);
  const [profile, setProfile] = useState(null);


  //firebase
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    // Retrieve profile from localStorage
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const login = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        setProfile(user); // Set user profile
        localStorage.setItem('profile', JSON.stringify(user)); // Store in localStorage
      }).catch((error) => {
        console.error('Login Failed:', error);
      });
  };
  const handleFeedbackClick = () => {
    window.open('https://forms.gle/mYw64PTEUC3C8RsWA', '_blank');
  };
  const logOut = () => {
    signOut(auth)
      .then(() => {
        setProfile(null);
        localStorage.removeItem('profile');
      })
      .catch((error) => {
        console.error('Logout Failed:', error);
      });
  };

  useEffect(() => {
    preloadImages();
  }, []);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setProfile(user);
        localStorage.setItem('profile', JSON.stringify(user));
      } else {
        setProfile(null);
        localStorage.removeItem('profile');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  return (
    <Router>
      <div className="App">
        {/* Feedback Link */}
        <Routes>
          <Route path="/about" element={<AboutPage profile={profile} login={login} logOut={logOut} />} />
          <Route path="/account" element={<AccountPage profile={profile} login={login} logOut={logOut} />} /> {/* New Route for Account Page */}
          <Route path="/" element={
            <>
              {/* Main Content */}
              {choice === "1" || choice === "2" ? (
                <>
                  <img src="/AI_tarot_final1_wise_woman3.png" alt="AI Tarot" className="bottom-right-image-woman" />
                  {/*<img src="/AI_tarot_final1_wise_woman_animation.png" alt="AI_female_animate" className="AI-woman-animate" />*/}
                  <img src="/AI_tarot_final1_wise_woman_animation2.png" alt="AI_female_animate" className="AI-woman-animate2" />

                  <div className="center-container">
                    <img src="/spell-visual1.png" alt="loading_female_animate" className={`loading-visual-female ${loading ? '' : 'hidden'}`} />
                  </div>

                </>
              ) : choice === "3" || choice === "4" ? (
                <>
                  <img src="/AI_tarot_final1_young_womanv2.png" alt="AI Tarot" className="bottom-right-image-female" />
                  <img src="/AI_tarot_final1_young_womanv2_animation.png" alt="AI_female_animate" className="AI-female-animate" />
                  <div className="center-container">
                    <img src="/spell-visual1.png" alt="loading_female_animate" className={`loading-visual-female ${loading ? '' : 'hidden'}`} />
                  </div>
                </>
              ) : choice === "" || choice === "5" ? (
                <>
                  <img src="/AI_tarot_final1.png" alt="AI Tarot" className="bottom-right-image" />
                  <img src="/AI_tarot_final1_purple.png" alt="Loading" className={`loading-image ${loading ? '' : 'hidden'}`} />
                  <img src="/tarotstar2.png" alt="Tarot Star" className="tarot-star" />
                </>
              ) : choice === "6" ? (
                <>

                  <img src="/AI_tarot_final1.png" alt="AI Tarot" className="bottom-right-image" />
                  <img src="/AI_tarot_final1_purple.png" alt="Loading" className={`loading-image ${loading ? '' : 'hidden'}`} />
                  <img src="/tarotstar2.png" alt="Tarot Star" className="tarot-star" />
                  {/*
                  <img src="/AI_tarot_final1_wise_manv2.png" alt="AI Tarot" className="bottom-right-image2" />
                  <img src="/AI_tarot_final1_purple.png" alt="Loading" className={`loading-image ${loading ? '' : 'hidden'}`} />
                  <img src="/AI_tarot_final1_wise_manv2_animation.png" alt="Tarot Star" className="oldman_fade" />
              */}
                </>
              ) : []
              }
              <header className="App-header">
                <div className="feedback-link" onClick={handleFeedbackClick}>
                  Help Us Improve!
                </div>
                <div className="header-buttons">
                  {profile ? (
                    <>
                      {/* Link to Account Page */}
                      <Link to="/account" className="my_account_button">
                        My Account
                      </Link>
                      {/* 
                      <button className="header-button-google" onClick={logOut}>
                        <img src="web_neutral_sq_na@1x.png" alt="Google" className="google-logo" />
                        Sign out
                      </button>
                      */}
                    </>
                  ) : (
                    <button className="header-button-google" onClick={login}>

                      <img src="web_neutral_sq_na@1x.png" alt="Google" className="google-logo" />
                      Sign in

                    </button>)}
                  { }
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
                  <div className="popup-overlay">
                    <div className="popup-content2">
                      <p>AI costs money, sign in for 2 free readings a day!<br />
                        <a href="https://www.buymeacoffee.com/alexdevries" target="_blank" rel="noopener noreferrer">
                          ☕ buy me a coffee ;) ☕
                        </a>
                      </p>
                    </div>
                    <button className="header-button-google" onClick={() => login()}>
                      <img src="web_neutral_sq_na@1x.png" alt="Google" className="google-logo" />
                      Sign in
                    </button>
                  </div>
                </div>
              )} </>
          } />
        </Routes>
      </div >
    </Router>
  );
}

export default App;
