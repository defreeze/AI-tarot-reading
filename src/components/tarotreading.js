import React, { useState, useEffect } from "react";
import TarotCards from './tarotcards';
import '../App.css';

function Tarotgen({ profile, setLoading, loading, choice, setChoice, showPasswordPage, setShowPasswordPage }) {
    const [emoji, setEmoji] = useState('');
    const [name, setName] = useState("");
    const [moodChoice, setMoodChoice] = useState("");

    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [cards, setCards] = useState([]);
    const [generatedText, setGeneratedText] = useState("");
    const [stage, setStage] = useState(0); // 0 for initial, 1 for after card selection, 2 for after evaluation
    const [tarotCard1Src, setTarotCard1Src] = useState('');
    const [tarotCard2Src, setTarotCard2Src] = useState('');
    const [tarotCard3Src, setTarotCard3Src] = useState('');
    const [showTarotDeck, setShowTarotDeck] = useState(true);
    const [tarotCard1Direction, setTarotCard1Direction] = useState('');
    const [tarotCard2Direction, setTarotCard2Direction] = useState('');
    const [tarotCard3Direction, setTarotCard3Direction] = useState('');
    const [loading2, setLoading2] = useState(false);
    const [showLimitPopup, setShowLimitPopup] = useState(false);

    <Tarotgen
        showPasswordPage={() => setShowPasswordPage(true)}
    />
    const [reading,] = useState({
        past: { name: "", reversed: false },
        present: { name: "", reversed: false },
        future: { name: "", reversed: false }
    });

    useEffect(() => {
        setCards([
            "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
            "The Pope", "The Lovers", "The Chariot", "Strength", "The Hermit",
            "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
            "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
            "Judgement", "The World",
            "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
            "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
            "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
            "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
            "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
            "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
            "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
            "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
            "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
            "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
            "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
            "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
        ]);
        // Function to pick a random emoji
        const emojis = ['💫', '🔮', '✨', '🌟', '🌙', '🌕', '🌖', '🌗', '🌘', '🌑', '💀', '🌈', '☄️', '🍀', '🪐', '🧞', '🌤️', '🏅', '🎭', '🎰', '🕯️', '📿', '🗝️', '🎊', '☀️', '⚡'
            , '🤖', '💝', '💞', '🃏', '👁️‍🗨️', '♾️', '🎶', '💔', '🧚‍♀️', '👼', '👑', '🐉', '🥀', '🎓', '🧬', '🙏', '🌹', '🌏', '🥠', '🍾', '💒', '💸', '🏳️', '🎐', '🕊️'];
        const pickRandomEmoji = () => {
            const randomIndex = Math.floor(Math.random() * emojis.length);
            return emojis[randomIndex];
        };
        setEmoji(pickRandomEmoji());
    }, []);

    const resetReading = () => {
        setStage(0);
        setShowTarotDeck(true);
        setTarotCard1Src('');
        setTarotCard2Src('');
        setTarotCard3Src('');
        setGeneratedText("");
        setResult("");
    };

    const pickCards = () => {
        setLoading2(true);
        setTarotCard1Direction(Math.random() < 0.5 ? '-100%' : '100%');
        setTarotCard2Direction(Math.random() < 0.5 ? '-100%' : '100%');
        setTarotCard3Direction(Math.random() < 0.5 ? '-100%' : '100%');

        setTarotCard1Src('tarot2_card1.png');

        setTimeout(() => {
            setTarotCard2Src('tarot4_card2.png');
        }, 500);

        setTimeout(() => {
            setTarotCard3Src('tarot6_card3.png');
        }, 1000);

        setTimeout(() => {
            document.querySelector('.tarot-deck-container').classList.add('fade-out');
        }, 2000);

        setTimeout(() => {
            setShowTarotDeck(false);

            let deck = [...cards];
            let past = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
            let present = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
            let future = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
            reading.current = {
                past: { name: past, reversed: Math.random() < 0.5 },
                present: { name: present, reversed: Math.random() < 0.5 },
                future: { name: future, reversed: Math.random() < 0.5 }
            };
            setStage(1);
            setLoading2(false);
        }, 3000); // Duration of the animation

    };
    const ReadingLimitPopup = () => {
        return (
            <div className="popup-overlay">
                <div className="popup-content">
                    <p>You've reached the limit of 2 readings per day.
                        <br />
                        If you like the app you can buy me a
                        <a href="https://www.buymeacoffee.com/alexdevries" target="_blank" rel="noopener noreferrer"> coffee ☕
                        </a>
                    </p>
                    <button onClick={() => setShowLimitPopup(false)}>Close</button>
                </div>
            </div>
        );
    };

    const generateTextAndImage = async () => {
        if (!profile) {
            setShowPasswordPage(true);
            return;
        }

        const now = new Date();

        // Retrieve stored click timestamps from localStorage
        const clicks = JSON.parse(localStorage.getItem('tarotClicks')) || [];

        // Filter out clicks that are not from today
        const todayClicks = clicks.filter(click => {
            const clickDate = new Date(click);
            return clickDate.toDateString() === now.toDateString();
        });

        if (todayClicks.length < 2) {

            setLoading(true);
            const { past, present, future } = reading.current;
            const textPrompt = `Generate a tarot reading based on these cards: Past - ${past}, Present - ${present}, Future - ${future}.`;

            try {
                const URL = process.env.REACT_APP_VALUE3 + process.env.REACT_APP_VALUE1 + process.env.REACT_APP_VALUE4

                // Step 1: Generate text with GPT
                const textResponse = await fetch('https://api.openai.com/v1/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${URL}`
                    },
                    body: JSON.stringify({
                        model: "text-davinci-003",
                        prompt: textPrompt,
                        max_tokens: 400
                    })
                });
                const textData = await textResponse.json();
                if (textData && textData.choices && textData.choices.length > 0 && textData.choices[0].text) {
                    setGeneratedText(textData.choices[0].text);
                    // Step 2: Use the generated text to create an image
                    const imagePrompt = `Digital art, visualize a person un-gendered in a spiritual environment based on this text: ${textData.choices[0].text}`;
                    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${URL}`
                        },
                        body: JSON.stringify({
                            prompt: imagePrompt,
                            n: 1,
                            size: "256x256",
                        })
                    });
                    const imageData = await imageResponse.json();
                    if (imageData.data && imageData.data.length > 0) {
                        setResult(imageData.data[0].url);
                    } else {
                        throw new Error("No image data returned");
                    }
                } else {
                    throw new Error("No text data returned from GPT");
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            } finally {
                setLoading(false);
                setStage(2);
            }
            todayClicks.push(now);
            localStorage.setItem('tarotClicks', JSON.stringify(todayClicks));
        } else {

            setShowLimitPopup(true);
        }

    };

    return (
        <div className="container">
            <h2>{emoji} Tarot reading by AI {emoji}</h2>
            <div className="input-wrapper">
                <div className="user-info">
                    <input
                        type="text"
                        className="user-input"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        title="Any name you self-identify with"
                    />
                    <select
                        className="user-input"
                        value={moodChoice}
                        onChange={(e) => setMoodChoice(e.target.value)}
                    >
                        <option value="" disabled selected>Your current mood</option>
                        <option value="1">Ecstatic</option>
                        <option value="2">Content</option>
                        <option value="3">Neutral</option>
                        <option value="4">Anxious</option>
                        <option value="5">Melancholic</option>
                        <option value="6">Other</option>
                    </select>

                    <select
                        className="user-select"
                        value={choice}
                        onChange={(e) => setChoice(e.target.value)}
                    >
                        <option value="" disabled selected>Tarot reading type</option>
                        <option value="1">Past/Present/Future</option>
                        <option value="2">Action & Outcome</option>
                        <option value="3">Relationship Dynamics</option>
                        <option value="4">Career Path</option>
                        <option value="5">Daily Insight</option>
                        <option value="6">Weekly Insight</option>
                    </select>
                </div>
                <textarea
                    className="prompt-input"
                    placeholder="This AI gives one-of-a-kind readings unique to you! Add details about your situation here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="1"
                />
            </div>

            {stage === 0 && (
                <button className="button-design" onClick={pickCards} disabled={loading2}>
                    {loading2 ? 'Drawing cards' : 'Click to draw cards'}
                </button>
            )}
            {/* deck container */}
            {showTarotDeck && (
                <div className="tarot-deck-container" >
                    <img src="tarot1_stack1.png" alt="tarot1_stack1" className="tarot1_stack1" />
                    {tarotCard1Src && <img src={tarotCard1Src} alt="tarot2_card1" className="tarot2_card1" style={{ '--slide-direction': tarotCard1Direction }} />}
                    <img src="tarot3_stack2.png" alt="tarot3_stack2" className="tarot3_stack2" />
                    {tarotCard2Src && <img src={tarotCard2Src} alt="tarot4_card2" className="tarot4_card2" style={{ '--slide-direction': tarotCard2Direction }} />}
                    <img src="tarot5_stack3.png" alt="tarot5_stack3" className="tarot5_stack3" />
                    {tarotCard3Src && <img src={tarotCard3Src} alt="tarot6_card3" className="tarot6_card3" style={{ '--slide-direction': tarotCard3Direction }} />}
                    <img src="tarot7_stack4.png" alt="tarot7_stack4" className="tarot7_stack4" />
                </div>)}



            {stage >= 1 && (
                <div className="tarot-cards-container">
                    <TarotCards reading={reading.current} />
                </div>
            )}


            {stage === 1 && (
                <button className="button-design" onClick={generateTextAndImage} disabled={loading}>
                    {loading ? 'thinking' : 'Receive reading by AI'}
                </button>
            )}
            {showLimitPopup && <ReadingLimitPopup />}

            {stage === 2 && (
                <button className="button-design" onClick={resetReading}>
                    Reset
                </button>
            )}

            {stage === 2 && generatedText && (
                <div className="generated-text">
                    <h3>Generated Reading</h3>
                    <p>{generatedText}</p>
                </div>
            )}


            {loading && <p className="loading-text">⏳ AI is reading your cards ⌛️</p>}



            {stage === 2 && result && (
                <div className="result-image-wrapper">
                    <h3>Your Tarot reading visualized</h3>
                    <p>The AI generated a unique visualization representing your tarot reading.</p>
                    <img className="result-image" src={result} alt="Generated Tarot Reading" />
                </div>
            )}
        </div>
    );



}

export default Tarotgen;
