import React, { useState, useEffect } from 'react';

function TarotCards({ reading }) {
    const [showBack, setShowBack] = useState({ past: true, present: true, future: true });

    const encodeFileName = (fileName) => {
        return fileName.split(' ').join('%20');
    };

    useEffect(() => {
        // Set timeouts to flip each card
        const timers = {
            past: setTimeout(() => setShowBack(back => ({ ...back, past: false })), 500),
            present: setTimeout(() => setShowBack(back => ({ ...back, present: false })), 1000),
            future: setTimeout(() => setShowBack(back => ({ ...back, future: false })), 1500)
        };

        return () => {
            // Clear timeouts on unmount
            clearTimeout(timers.past);
            clearTimeout(timers.present);
            clearTimeout(timers.future);
        };
    }, []);

    return (
        <div className="tarot-cards">
            <div className="card-animation card-delay-1">
                {showBack.past
                    ? <img src="/back2.jpg" alt="Card Back" />
                    : reading.past && <img src={`/tarot_deck/${encodeFileName(reading.past)}.jpg`} alt={reading.past} />}
                <h5>{reading.past}</h5>
            </div>
            <div className="card-animation card-delay-2">
                {showBack.present
                    ? <img src="/back2.jpg" alt="Card Back" />
                    : reading.present && <img src={`/tarot_deck/${encodeFileName(reading.present)}.jpg`} alt={reading.present} />}
                <h5>{reading.present}</h5>
            </div>
            <div className="card-animation card-delay-3">
                {showBack.future
                    ? <img src="/back2.jpg" alt="Card Back" />
                    : reading.future && <img src={`/tarot_deck/${encodeFileName(reading.future)}.jpg`} alt={reading.future} />}
                <h5>{reading.future}</h5>
            </div>
        </div>
    );
}

export default TarotCards;
