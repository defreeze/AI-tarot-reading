import '../App.css';
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";


function ImageGenerator() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const [placeholder, setPlaceholder] = useState(
        "Type your tattoo idea here..."
    );

    const configuration = new Configuration({
        apiKey: "apikeyhere",
    });

    const openai = new OpenAIApi(configuration);

    const generateImage = async () => {
        setPlaceholder(`Tattoo for ${prompt}..`);
        setLoading(true);

        try {
            const res = await openai.createImage({
                prompt: `line art tattoo. white background, white border, black lines: ${prompt}`,
                n: 1,
                size: "512x512",
            });

            setLoading(false);
            setResult(res.data.data[0].url);
        } catch (error) {
            setLoading(false);
            console.error(`Error generating image: ${error.response.data.error.message}`);
        }
    };
    return (
        <div className="container">
            {loading ? (
                <>
                    <h3>Generating tattoo, please wait...</h3>
                </>
            ) : (
                <>
                    <h2>AI overlord deciding your tattoo fate</h2>

                    <div className="input-wrapper">
                        <textarea
                            className="app-input"
                            placeholder={placeholder}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows="1"
                            cols="50"
                        />
                        <button onClick={generateImage}>Generate tattoo</button>
                    </div>

                    {result.length > 0 ? (
                        <img className="result-image" src={result} alt="result" />
                    ) : (
                        <>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default ImageGenerator