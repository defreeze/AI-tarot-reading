import React from 'react';
import { Link } from 'react-router-dom';
import './aboutPage.css';

function AboutPage() {
    return (
        <div className="aboutPage">
            <div className="container2">
                <div className="header-buttons">
                    <Link to="/">
                        <button className="home-button">Home</button>
                    </Link>
                </div>
                <h3>About Page</h3>

                {/* Two-column layout */}
                <div className="about-section">
                    <div className="about-column">
                        <h5>About App</h5>
                        <p>The first app to let AI read your tarot! What follows is a non-technical explanation of the logic. This description is for tarot enthousiasts who want want to know how the tarot readings are created.</p>
                        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Step 1</p>
                        <p>Text text text</p>
                        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Step 2</p>
                        <p>Text text text</p>


                    </div>
                    <div className="about-column">
                        <h5>About Me</h5>
                        <p>
                            Hi, I hope you enjoy using this app. Feel free to reach out through my website&nbsp;
                            <a href="https://www.alexdevri.es/contact" target="_blank" rel="noopener noreferrer">
                                www.alexdevri.es/contact
                            </a>.
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

export default AboutPage;
