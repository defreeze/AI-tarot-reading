// AccountPage.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountPage.css';

function AccountPage({ profile, logOut }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!profile) {
            navigate('/'); // Redirect to home if not logged in
        }
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
                            Enjoy using the app? We're actively developing new features, including a subscription option for unlimited access and to support our development efforts!
                        </p>
                        <br></br>
                        <p className="centered-text">
                            We value your opinion! <a href="https://forms.gle/mYw64PTEUC3C8RsWA" target="_blank" rel="noopener noreferrer">share feedback here</a>
                        </p>
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
