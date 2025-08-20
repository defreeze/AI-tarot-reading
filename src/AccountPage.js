// AccountPage.js
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountPage.css';


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
                    <div className="about-column">
                        <h5>Settings</h5>

                        <p>

                        </p>
                        <p className="centered-text">
                            We value your opinion! <a href="https://forms.gle/mYw64PTEUC3C8RsWA" target="_blank" rel="noopener noreferrer">share feedback here</a>
                        </p>
                        {/* Stripe Payment Button */}

                </div>

                <footer className="App-footer2">
                    made by <a href="https://www.alexdevri.es" target="_blank" rel="noopener noreferrer">alexdevri.es</a>
                </footer>
            </div>
        </div>
    );
}

export default AccountPage;
