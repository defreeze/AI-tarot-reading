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
                            src={`/tarot_deck/${encodeFileName(reading.past.name)}.jpg`}
                            alt={reading.past.name}
                            className={reading.past.reversed ? 'reversed' : ''}
                            onLoad={() => handleImageLoad('past')}
                        />
                        {imagesLoaded.past && <h5>
                            {reading.past.name}
                            {reading.past.reversed && <div className="reversed-text"> Reversed</div>}
                        </h5>}
                    </>
                )}
            </div>
            <div className="card-animation card-delay-2">
                {reading.present && (
                    <>
                        <img
                            src={`/tarot_deck/${encodeFileName(reading.present.name)}.jpg`}
                            alt={reading.present.name}
                            className={reading.present.reversed ? 'reversed' : ''}
                            onLoad={() => handleImageLoad('present')}
                        />
                        {imagesLoaded.present && <h5>
                            {reading.present.name}
                            {reading.present.reversed && <div className="reversed-text"> Reversed</div>}
                        </h5>}
                    </>
                )}
            </div>
            <div className="card-animation card-delay-3">
                {reading.future && (
                    <>
                        <img
                            src={`/tarot_deck/${encodeFileName(reading.future.name)}.jpg`}
                            alt={reading.future.name}
                            className={reading.future.reversed ? 'reversed' : ''}
                            onLoad={() => handleImageLoad('future')}
                        />
                        {imagesLoaded.future && <h5>
                            {reading.future.name}
                            {reading.future.reversed && <div className="reversed-text"> Reversed</div>}
                        </h5>}
                    </>
                )}
            </div>
        </div>
    );
}

export default TarotCards;
