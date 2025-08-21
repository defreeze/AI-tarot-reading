import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import TarotCards from './tarotcards';
import './ReadingHistory.css';

const ReadingHistory = ({ userId }) => {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReading, setSelectedReading] = useState(null);

    const highlightCardNames = (text, cards) => {
        if (!cards) return text;
        let modifiedText = text;
        const cardNames = [cards.past?.name, cards.present?.name, cards.future?.name].filter(Boolean);

        // Highlight the card names
        cardNames.forEach(card => {
            if (card) {
                const regex = new RegExp(`\\b${card}\\b`, 'gi');
                modifiedText = modifiedText.replace(regex, `<span style="color:#b98145;">${card}</span>`);
            }
        });
        return modifiedText;
    };

    useEffect(() => {
        if (userId) {
            fetchReadingHistory();
        }
    }, [userId]);

    // Scroll to the rightmost position (most recent readings) after readings are loaded
    useEffect(() => {
        if (readings.length > 0) {
            const timelineContainer = document.querySelector('.timeline-container');
            if (timelineContainer) {
                // Scroll to the rightmost position
                timelineContainer.scrollLeft = timelineContainer.scrollWidth;
            }
        }
    }, [readings]);

    const fetchReadingHistory = async () => {
        try {
            console.log('Fetching reading history for user:', userId);
            const readingsRef = collection(db, 'readings');
            const q = query(
                readingsRef,
                where('userId', '==', userId),
                orderBy('timestamp', 'asc')
            );
            console.log('Query:', q);
            
            const querySnapshot = await getDocs(q);
            console.log('Query snapshot:', querySnapshot);
            console.log('Number of docs:', querySnapshot.docs.length);
            
            const readingsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('Readings data:', readingsData);
            
            setReadings(readingsData);
        } catch (error) {
            console.error('Error fetching reading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate();
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + ' at ' + date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
        return 'Unknown date';
    };

    const formatDateShort = (timestamp) => {
        if (timestamp instanceof Timestamp) {
            return timestamp.toDate().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        return 'Unknown date';
    };

    const getReadingTypeLabel = (type) => {
        const types = {
            '1': 'Past/Present/Future',
            '2': 'Action/Outcome',
            '3': 'Relationship Review',
            '4': 'Career Path',
            '5': 'Daily Insight',
            '6': 'Weekly Insight',
            '7': 'General Reading'
        };
        return types[type] || 'Unknown Type';
    };

    const handleReadingClick = (reading) => {
        if (selectedReading && selectedReading.id === reading.id) {
            setSelectedReading(null); // Close if clicking the same reading
        } else {
            setSelectedReading(reading);
        }
    };

    if (loading) {
        return <div className="history-loading">Loading your reading history...</div>;
    }

    if (readings.length === 0) {
        return (
            <div className="history-empty">
                <h3>No readings yet</h3>
                <p>Your tarot reading history will appear here once you complete your first reading.</p>
            </div>
        );
    }

    return (
        <div className="reading-history">
            <h6>Tarot Reading History</h6>
            <div className="timeline-line"></div>
            <div className="timeline-container">
                <div className="timeline-content-wrapper">
                    {readings.map((reading, index) => (
                        <div key={reading.id} className="timeline-item">
                            <div 
                                className={`timeline-dot ${index >= readings.length - 3 ? 'clickable' : ''}`}
                                onClick={() => index >= readings.length - 3 ? handleReadingClick(reading) : null}
                                title={index >= readings.length - 3 ? 'Click to view reading' : 'Upgrade to view older readings'}
                            >
                            </div>
                            <div className="timeline-content">
                                <div className="reading-info">
                                    <span className="reading-type">{getReadingTypeLabel(reading.readingType)}</span>
                                    <span className="reading-date">{formatDateShort(reading.timestamp)}</span>
                                </div>
                                {index < readings.length - 3 && (
                                    <div className="upgrade-prompt">
                                        <small>💎 Premium needed</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

                   {/* Reading Details Below Timeline */}
                   {selectedReading && (
                       <div className="reading-details">
                           <div className="details-header">
                               <h3>{getReadingTypeLabel(selectedReading.readingType)}</h3>
                               <button className="close-button" onClick={() => setSelectedReading(null)}>×</button>
                           </div>
                           <div className="details-content">
                               <div className="reading-date">
                                   {formatDate(selectedReading.timestamp)}
                               </div>
                               
                               {/* Display cards using the same component as the original reading */}
                               <div className="reading-cards">
                                   <div className="tarot-cards-container">
                                       <TarotCards reading={selectedReading.cards} />
                                   </div>
                               </div>
                               
                               <div className="reading-text">
                                   <div className="reading-content">
                                       <div dangerouslySetInnerHTML={{ 
                                           __html: highlightCardNames(selectedReading.generatedText, selectedReading.cards).replace(/\n/g, '<br />') 
                                       }} />
                                   </div>
                               </div>
                               
                                                               {/* Disclaimer - same as original reading */}
                                <p className="disclaimer-text">
                                    Disclaimer: Our AI tarot readers can offer guidance, but the path you choose is your own. Embrace the mystery, trust your intuition, and follow your heart.
                                </p>
                           </div>
                       </div>
                   )}
               </div>
           );
       };

export default ReadingHistory; 