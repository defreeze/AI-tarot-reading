import React, { useState, useEffect, useRef } from "react";
import TarotCards from './tarotcards';
import '../App.css';

function Tarotgen() {
    const [emoji, setEmoji] = useState('');
    const [name, setName] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [choice, setChoice] = useState("");
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const reading = useRef({ past: "", present: "", future: "" });
    const [generatedText, setGeneratedText] = useState("");
    const [stage, setStage] = useState(0); // 0 for initial, 1 for after card selection, 2 for after evaluation

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
            , '🤖', '💝', '💞', '🃏', '🚩', '👁️‍🗨️', '♾️', '🎶', '💔', '🧚‍♀️', '👼', '👑', '🐉', '🥀', '🎓', '🧬', '🙏', '🌹', '🌏', '🥠', '🍾', '💒', '💸', '🏳️', '🎐', '🕊️'];
        const pickRandomEmoji = () => {
            const randomIndex = Math.floor(Math.random() * emojis.length);
            return emojis[randomIndex];
        };
        setEmoji(pickRandomEmoji());
    }, []);

    const pickCards = () => {
        let deck = [...cards];
        let past = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
        let present = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
        let future = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
        reading.current = { past, present, future };
        setStage(1); // Move to the next stage after picking cards
    };

    const generateTextAndImage = async () => {
        setLoading(true);
        const selectedReading = pickCards();
        reading.current = selectedReading;

        // selectedReading.past
        // selectedReading.present
        // selectedReading.future
        // each selectedreading value has an image with .jpg in the tarot_deck directory

        const textPrompt = `Generate a tarot reading based on these cards: Past - ${selectedReading.past}, Present - ${selectedReading.present}, Future - ${selectedReading.future}.`;

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
                        size: "512x512",
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
            setStage(2); // Move to the final stage after generating text and image
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
                    />
                    <input
                        type="datetime-local"
                        id="birth-date-time"
                        className="user-input"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        title="Set your date/ time of birth"
                    />
                    <select
                        className="user-select"
                        value={choice}
                        onChange={(e) => setChoice(e.target.value)}
                    >
                        <option value="">Select Your Reading</option>
                        <option value="1">Understand a Situation</option>
                        <option value="2">Make a Decision</option>
                        <option value="3">Past/Present/Future</option>
                    </select>
                </div>
                <textarea
                    className="prompt-input"
                    placeholder="This AI gives one-of-a-kind readings unique to you! Add details about your situation here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="3"
                />
            </div>

            <button onClick={stage === 0 ? pickCards : generateTextAndImage} disabled={loading}>
                {loading ? 'Generating...' : stage === 0 ? 'Get Tarot Reading' : 'Evaluate Cards'}
            </button>

            {stage >= 1 && (
                <TarotCards reading={reading.current} />
            )}

            {stage === 2 && generatedText && (
                <div className="generated-text">
                    <h3>Generated Reading</h3>
                    <p>{generatedText}</p>
                </div>
            )}
            {loading && <p className="loading-text">🌠 AI is reading your cards 🌠</p>}

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
