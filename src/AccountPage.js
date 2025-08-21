// AccountPage.js
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountPage.css';
import ReadingHistory from './components/ReadingHistory';
import AccountInfo from './components/AccountInfo';

function AccountPage({ profile, logOut }) {
    const navigate = useNavigate();
    const stripeButtonRef = useRef(null);

    useEffect(() => {
        if (!profile) {
            navigate('/'); // Redirect to home if not logged in


    }, [profile, navigate]);

    const handleLogOut = () => {
        logOut();
        navigate('/');
    };
    if (!profile) {
        return null; // Render nothing while redirecting or if not logged in
    }

    return (
        <div className="aboutPage">
            <div className="container2">
                <div className="header-buttons1">
                    {profile && (
                        <button className="header-button-google" onClick={handleLogOut}>
                            Sign out
                        </button>
                    )}
                </div>
                <div className="header-buttons">
                    <Link to="/" className="header-link">
                        <button className="home-button">Home</button>
                    </Link>
                </div>
                <h3>👑My Account</h3>
                {/* Two-column layout */}
                                       <div className="about-section">
                           {/* Reading History Section */}
                           <ReadingHistory userId={profile.uid} />
                           
                           {/* Account Statistics Section */}
                           <AccountInfo userId={profile.uid} />
                           
                           <div className="about-column" style={{ marginTop: '30px' }}>

                        <p>
                            Enjoy the app? Please donate or subscribe to increase your reading limit and past reading storage! We greatly appreciate your support and feedback!
                        </p>
                        <p className="centered-text">
                            We value your opinion! <a href="https://forms.gle/mYw64PTEUC3C8RsWA" target="_blank" rel="noopener noreferrer">share feedback here</a>
                        </p>
                        {/* Stripe Payment Button */}
                        <div ref={stripeButtonRef} className="stripe-container"></div>

                    </div>
                </div>

                <footer className="App-footer2">
                    made by <a href="https://www.alexdevri.es" target="_blank" rel="noopener noreferrer">alexdevri.es</a>
                </footer>
            </div>
        </div>
    );
}

export default AccountPage;
