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
                        <h5>About the App</h5>
                        <p>What follows is a non-technical explanation of the logic of the app. This description is for tarot enthousiasts who want to know how the tarot readings are created. The video shows the full reading process.</p>
                        <video width="100%" autoPlay muted loop style={{ border: '1px solid black' }}>
                            <source src="tarotdemo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Step 1: Get User input</p>
                        <p>Text text text</p>
                        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Step 2: Pull 3 cards</p>
                        <p>Text text text</p>
                        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Step 3: Create question for AI</p>
                        <p>Text text text</p>
                        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Step 4: Create visualisation</p>
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
