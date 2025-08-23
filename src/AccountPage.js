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
        }
    }, [profile, navigate]);

    // Load Stripe buttons
    useEffect(() => {
        if (stripeButtonRef.current) {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/buy-button.js';
            script.async = true;
            script.onload = () => {
                if (stripeButtonRef.current) {
                    stripeButtonRef.current.innerHTML = `
                        <div class="stripe-buttons-container">
                            <stripe-buy-button
                            buy-button-id="buy_btn_1OeOtJHT5oVjW8Cf06ub65LB"
                            publishable-key="pk_live_51OeNIGHT5oVjW8CfCamtlKEIh0Sgk0TaL4VyqCtIeoj7BVS1ozyp8D1LjgaVZqLUKyK1FOZ3C7g50ogUlIIWdccB00X41v6XyF"
                            >
                            </stripe-buy-button>
                            <stripe-buy-button
                            buy-button-id="buy_btn_1OeNxWHT5oVjW8CfHueYoAj1"
                            publishable-key="pk_live_51OeNIGHT5oVjW8CfCamtlKEIh0Sgk0TaL4VyqCtIeoj7BVS1ozyp8D1LjgaVZqLUKyK1FOZ3C7g50ogUlIIWdccB00X41v6XyF"
                            >
                            </stripe-buy-button>
                        </div>
                    `;
                }
            };
            stripeButtonRef.current.appendChild(script);
        }
    }, []);

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
                
                <div className="about-section">
                    {/* Reading History Section */}
                    <ReadingHistory userId={profile.uid} />
                    
                    {/* Account Statistics Section */}
                    {console.log('AccountPage: Profile object:', profile)}
                    {console.log('AccountPage: Profile UID:', profile?.uid)}
                    <AccountInfo userId={profile.uid} />
                    
                    {/* Settings/Donation Section */}
                    <div className="about-column">
                        {/* <h2>Upgrade to Premium</h2>*/}
                        <div className="trial-info">
                            <p><strong>🎉 Consider a 3-day free trial!</strong></p>
                            <p>Enjoy the app? Please donate or subscribe to increase your reading limit and past reading storage! We greatly appreciate your support and feedback!</p>
                        </div>
                        
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