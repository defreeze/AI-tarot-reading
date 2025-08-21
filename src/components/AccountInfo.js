import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getUserDocument, isUserPremium } from '../utils/userManagement';
import './AccountInfo.css';

function AccountInfo({ userId }) {
    const getReadingTypeName = (typeNumber) => {
        const typeMap = {
            1: 'Past/Present/Future',
            2: 'Action/Outcome', 
            3: 'Relationship Review',
            4: 'Career Path',
            5: 'Daily Insight',
            6: 'Weekly Insight'
        };
        return typeMap[typeNumber] || `Type ${typeNumber}`;
    };

    const [stats, setStats] = useState({
        totalReadings: 0,
        readingsThisMonth: 0,
        readingTypes: {},
        lastReadingDate: null
    });
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccountData = async () => {
            if (!userId) return;

            try {
                // Fetch user document with subscription data
                const userDoc = await getUserDocument(userId);
                setUserData(userDoc);

                // Get all readings for the user
                const readingsRef = collection(db, 'readings');
                const q = query(readingsRef, where('userId', '==', userId));
                const querySnapshot = await getDocs(q);

                console.log('Found readings:', querySnapshot.size); // Debug log

                const readings = [];
                const types = {};
                const typeLastUsed = {};
                let thisMonthCount = 0;
                const now = new Date();
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                querySnapshot.forEach((doc) => {
                    const reading = doc.data();
                    console.log('Reading data:', reading); // Debug log
                    readings.push(reading);
                    
                    // Count reading types - check multiple possible field names
                    let type = 'General';
                    if (reading.readingType) {
                        type = reading.readingType;
                    } else if (reading.choice) {
                        type = reading.choice;
                    } else if (reading.type) {
                        type = reading.type;
                    }
                    
                    console.log('Reading type found:', type); // Debug log
                    
                    // Convert numeric types to readable names if needed
                    if (typeof type === 'number' || !isNaN(type)) {
                        type = getReadingTypeName(type);
                    }
                    
                    types[type] = (types[type] || 0) + 1;
                    
                    // Track when this type was last used
                    if (reading.timestamp) {
                        const readingDate = reading.timestamp.toDate();
                        if (!typeLastUsed[type] || readingDate > typeLastUsed[type]) {
                            typeLastUsed[type] = readingDate;
                        }
                    }
                    
                    // Count readings this month
                    if (reading.timestamp && reading.timestamp.toDate() >= firstDayOfMonth) {
                        thisMonthCount++;
                    }
                });

                console.log('Processed readings:', readings.length); // Debug log
                console.log('Reading types:', types); // Debug log

                // Get most recent reading date
                const sortedReadings = readings.sort((a, b) => 
                    b.timestamp?.toDate() - a.timestamp?.toDate()
                );

                console.log('Last reading date:', sortedReadings[0]?.timestamp); // Debug log

                setStats({
                    totalReadings: readings.length,
                    readingsThisMonth: thisMonthCount,
                    readingTypes: types,
                    lastReadingDate: sortedReadings[0]?.timestamp?.toDate(),
                    typeLastUsed: typeLastUsed
                });
            } catch (error) {
                console.error('Error fetching account data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [userId]);

    if (loading) {
        return (
            <div className="account-info-box">
                <h5>Statistics</h5>
                <p>Loading...</p>
            </div>
        );
    }

    const formatDate = (date) => {
        if (!date) return 'Never';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getFavoriteReadingType = () => {
        if (Object.keys(stats.readingTypes).length === 0) {
            return 'None yet';
        }
        
        // Find the highest count
        const maxCount = Math.max(...Object.values(stats.readingTypes));
        
        // Get all types with the maximum count
        const topTypes = Object.entries(stats.readingTypes)
            .filter(([, count]) => count === maxCount)
            .map(([type]) => type);
        
        if (topTypes.length === 1) {
            // Only one type has the highest count
            return topTypes[0];
        } else {
            // Multiple types have the same count, find the most recent one
            let mostRecentType = topTypes[0];
            let mostRecentDate = stats.typeLastUsed[topTypes[0]] || new Date(0);
            
            for (const type of topTypes) {
                const lastUsed = stats.typeLastUsed[type] || new Date(0);
                if (lastUsed > mostRecentDate) {
                    mostRecentType = type;
                    mostRecentDate = lastUsed;
                }
            }
            
            return mostRecentType;
        }
    };



    return (
        <div className="account-info-box">
            <h5>Statistics</h5>
            
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-number">{stats.totalReadings}</div>
                    <div className="stat-label">Total Readings</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-number">{stats.readingsThisMonth}</div>
                    <div className="stat-label">This Month</div>
                </div>
                
                <div className="stat-item">
                    <div className="stat-number">
                        {userData && isUserPremium(userData) ? '5' : Math.max(0, 2 - stats.readingsThisMonth)}
                    </div>
                    <div className="stat-label">Daily Limit</div>
                </div>
            </div>

            <div className="stats-details">
                <div className="details-grid">
                    <div className="detail-box">
                        <div className="detail-label">Last Reading</div>
                        <div className="detail-value">{formatDate(stats.lastReadingDate)}</div>
                    </div>
                    
                                         <div className="detail-box">
                         <div className="detail-label">Account Status</div>
                         <div className="detail-value">
                             {userData && isUserPremium(userData) ? (
                                 <span style={{ color: '#b98145', fontWeight: 'bold' }}>
                                     💎 Premium User
                                 </span>
                             ) : (
                                 <span style={{ color: '#4682b4', fontWeight: 'bold' }}>
                                     💸 Free User
                                 </span>
                             )}
                         </div>
                     </div>
                    
                    <div className="detail-box">
                        <div className="detail-label">Favorite Reading Type</div>
                        <div className="detail-value">
                            {getFavoriteReadingType()}
                        </div>
                    </div>
                </div>
                
                {userData && userData.subscriptionEndDate && (
                    <div className="detail-row">
                        <span className="detail-label">Subscription:</span>
                        <span className="detail-value">
                            {userData.accountStatus === 'premium' ? (
                                <span style={{ color: '#b98145' }}>
                                    Active until {formatDate(userData.subscriptionEndDate.toDate())}
                                </span>
                            ) : (
                                <span style={{ color: '#cccccc' }}>
                                    Expired on {formatDate(userData.subscriptionEndDate.toDate())}
                                </span>
                            )}
                        </span>
                    </div>
                )}
                
                {userData && userData.subscriptionStartDate && (
                    <div className="detail-row">
                        <span className="detail-label">Started:</span>
                        <span className="detail-value">
                            {formatDate(userData.subscriptionStartDate.toDate())}
                        </span>
                    </div>
                )}
                
                {userData && userData.lastPaymentDate && (
                    <div className="detail-row">
                        <span className="detail-label">Last Payment:</span>
                        <span className="detail-value">
                            {formatDate(userData.lastPaymentDate.toDate())}
                        </span>
                    </div>
                )}
                
                <div className="plan-comparison">
                    <h6>Free vs Premium account</h6>
                    <div className="comparison-table">
                        <div className="comparison-header">
                            <div className="feature-label">Features</div>
                            <div className={`plan-column ${!userData || !isUserPremium(userData) ? 'highlighted' : ''}`}>
                                Free Plan
                            </div>
                            <div className={`plan-column ${userData && isUserPremium(userData) ? 'highlighted' : ''}`}>
                            💎Premium Plan
                            </div>
                        </div>
                        
                        <div className="comparison-row">
                            <div className="feature-label">Daily Readings</div>
                            <div className={`plan-value ${!userData || !isUserPremium(userData) ? 'highlighted' : ''}`}>2</div>
                            <div className={`plan-value ${userData && isUserPremium(userData) ? 'highlighted' : ''}`}>5</div>
                        </div>
                        
                        <div className="comparison-row">
                            <div className="feature-label">History Access</div>
                            <div className={`plan-value ${!userData || !isUserPremium(userData) ? 'highlighted' : ''}`}>3 most recent</div>
                            <div className={`plan-value ${userData && isUserPremium(userData) ? 'highlighted' : ''}`}>Unlimited</div>
                        </div>
                        
                        <div className="comparison-row">
                            <div className="feature-label">New Features</div>
                            <div className={`plan-value ${!userData || !isUserPremium(userData) ? 'highlighted' : ''}`}>Standard access</div>
                            <div className={`plan-value ${userData && isUserPremium(userData) ? 'highlighted' : ''}`}>First access</div>
                        </div>
                        
                        <div className="comparison-row">
                            <div className="feature-label">Community</div>
                            <div className={`plan-value ${!userData || !isUserPremium(userData) ? 'highlighted' : ''}`}>Read only</div>
                            <div className={`plan-value ${userData && isUserPremium(userData) ? 'highlighted' : ''}`}>Forum access</div>
                        </div>
                        
                        <div className="comparison-row">
                            <div className="feature-label">Developer happiness</div>
                            <div className={`plan-value ${!userData || !isUserPremium(userData) ? 'highlighted' : ''}`}>🙂</div>
                            <div className={`plan-value ${userData && isUserPremium(userData) ? 'highlighted' : ''}`}>😁🎉</div>
                        </div>
                    </div>
                </div>
                
                {userData && !isUserPremium(userData) && (
                    <div className="upgrade-prompt">
                        <p>💎 Upgrade to Premium for all the latest features and support development!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountInfo;
