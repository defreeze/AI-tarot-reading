import React, { useState } from "react";
import OpenAI from "openai";
import '../App.css';

function ImageGenerator() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [placeholder, setPlaceholder] = useState("Type your tattoo idea here...");

    // Initialize OpenAI with your API key
    //const openai = new OpenAI(process.env.REACT_APP_OPENAI_API_KEY);
    const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });



    const generateImage = async () => {
        setPlaceholder(`Tattoo for ${prompt}...`);
        setLoading(true);

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: `line art tattoo. white background, white border, black lines: ${prompt}`,
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
                <h3>Generating tattoo, please wait...</h3>
            ) : (
                <>
                    <h2>AI Overlord Deciding Your Tattoo Fate</h2>
                    <div className="input-wrapper">
                        <textarea
                            className="app-input"
                            placeholder={placeholder}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows="1"
                            cols="50"
                        />
                        <button onClick={generateImage}>Generate Tattoo</button>
                    </div>

                    {result.length > 0 && (
                        <img className="result-image" src={result} alt="Generated Tattoo" />
                    )}
                </>
            )}
        </div>
    );
}

export default ImageGenerator;
