import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import '../App.css';

function ImageGenerator() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [choice, setChoice] = useState("");
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [reading, setReading] = useState({ past: "", present: "", future: "" });

    useEffect(() => {
        setCards([
            "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
            "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
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
    }, []);

    const pickCards = () => {
        let deck = [...cards];
        let past = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
        let present = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
        let future = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
        return { past, present, future };
    };

    const generateImage = async () => {
        setLoading(true);
        const selectedReading = pickCards();
        setReading(selectedReading);

        const fullPrompt = `Name: ${name}, Age: ${age}, Choice: ${choice}. Tarot reading: Past - ${selectedReading.past}, Present - ${selectedReading.present}, Future - ${selectedReading.future}. ${prompt}`;

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: `Digital art, visualise a person un-gendered in a spiritual tarot card environment based on this prompt: ${fullPrompt}`,
                    n: 1,
                    size: "512x512",
                })
            });

            const data = await response.json();
            setLoading(false);
            if (data.data && data.data.length > 0) {
                setResult(data.data[0].url);
            } else {
                throw new Error("No image data returned");
            }
        } catch (error) {
            setLoading(false);
            console.error(`Error generating image: ${error.message}`);
        }
    };

    return (
        <div className="container">
            {loading ? (
                <h3>Shuffling cards, please wait...</h3>
            ) : (
                <>
                    <h2>AI Genie Reading Your Future</h2>
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
                                type="number"
                                className="user-input"
                                placeholder="Enter your age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            <select
                                className="user-select"
                                value={choice}
                                onChange={(e) => setChoice(e.target.value)}
                            >
                                <option value="">Select Your Reading</option>
                                <option value="1">Understanding a Situation</option>
                                <option value="2">Make a Decision</option>
                                <option value="3">Past/Present/Future</option>
                            </select>
                        </div>
                        <textarea
                            className="prompt-input"
                            placeholder="Explain your situation as you feel comfortable with..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows="3"
                        />
                        <button onClick={generateImage}>Get a Tarot Reading</button>
                    </div>

                    {result.length > 0 && (
                        <img className="result-image" src={result} alt="Generated Reading" />
                    )}
                </>
            )}
        </div>
    );
}

export default ImageGenerator;
