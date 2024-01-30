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
        }
        const script = document.createElement('script');
        script.src = "https://js.stripe.com/v3/buy-button.js";
        script.async = true;
        script.onload = () => {
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
        };
        stripeButtonRef.current.appendChild(script);


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
                        <p className="centered-text">
                            We value your opinion! <a href="https://forms.gle/mYw64PTEUC3C8RsWA" target="_blank" rel="noopener noreferrer">share feedback here</a>
                        </p>
                        {/* Stripe Payment Button */}
                        <div ref={stripeButtonRef}></div>

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
