import React, { useState, useEffect } from 'react';

function TarotCards({ reading }) {
    const [imagesLoaded, setImagesLoaded] = useState({ past: false, present: false, future: false });

    const encodeFileName = (fileName) => {
        return fileName.split(' ').join('%20');
    };

    const handleImageLoad = (card) => {
        setImagesLoaded(prevState => ({ ...prevState, [card]: true }));
    };

    useEffect(() => {
        setImagesLoaded({ past: false, present: false, future: false });
    }, [reading]);

    return (
        <div className="tarot-cards">
            <div className="card-animation card-delay-1">
                {reading.past && (
                    <>
                        <img
                            src={`/tarot_deck/${encodeFileName(reading.past)}.jpg`}
                            alt={reading.past}
                            onLoad={() => handleImageLoad('past')}
                        />
                        {imagesLoaded.past && <h5>{reading.past}</h5>}
                    </>
                )}
            </div>
            <div className="card-animation card-delay-2">
                {reading.present && (
                    <>
                        <img
                            src={`/tarot_deck/${encodeFileName(reading.present)}.jpg`}
                            alt={reading.present}
                            onLoad={() => handleImageLoad('present')}
                        />
                        {imagesLoaded.present && <h5>{reading.present}</h5>}
                    </>
                )}
            </div>
            <div className="card-animation card-delay-3">
                {reading.future && (
                    <>
                        <img
                            src={`/tarot_deck/${encodeFileName(reading.future)}.jpg`}
                            alt={reading.future}
                            onLoad={() => handleImageLoad('future')}
                        />
                        {imagesLoaded.future && <h5>{reading.future}</h5>}
                    </>
                )}
            </div>
        </div>
    );
}

export default TarotCards;
