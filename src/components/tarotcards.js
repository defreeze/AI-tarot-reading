import React from 'react';

function TarotCards({ reading }) {
    const encodeFileName = (fileName) => {
        return fileName.split(' ').join('%20');
    };
    console.log(reading);
    console.log("Past Card Image URL: ", `/tarot_deck/${encodeFileName(reading.past)}.jpg`);
    console.log("Present Card Image URL: ", `/tarot_deck/${encodeFileName(reading.present)}.jpg`);
    console.log("Future Card Image URL: ", `/tarot_deck/${encodeFileName(reading.future)}.jpg`);

    return (
        <div className="tarot-cards">
            <div className="card-animation card-delay-1">
                {reading.past && <img src={`/tarot_deck/${encodeFileName(reading.past)}.jpg`} alt={reading.past} />}
                <h5>{reading.past}</h5>
            </div>
            <div className="card-animation card-delay-2">
                {reading.present && <img src={`/tarot_deck/${encodeFileName(reading.present)}.jpg`} alt={reading.present} />}
                <h5>{reading.present}</h5>
            </div>
            <div className="card-animation card-delay-3">
                {reading.future && <img src={`/tarot_deck/${encodeFileName(reading.future)}.jpg`} alt={reading.future} />}
                <h5>{reading.future}</h5>
            </div>
        </div>
    );
}

export default TarotCards;
