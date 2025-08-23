import { doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs, deleteField } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Helper functions for week boundaries
export const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek; // If it's Sunday, don't subtract
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
};

export const getWeekEnd = () => {
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;
};

// Create or update user document
export const createOrUpdateUser = async (userId, userData = {}) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            // New user - create with default values
            const newUserData = {
                uid: userId,
                email: userData.email || '',
                displayName: userData.displayName || '',
                weeklyReadingLimit: 7,
                weeklyReadingsUsed: 0,
                lastWeekReset: getWeekStart(),
                isPremium: false,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                ...userData
            };
            
            await setDoc(userRef, newUserData);
            console.log('New user created:', userId);
            return newUserData;
        } else {
            // Existing user - update last updated timestamp
            await updateDoc(userRef, {
                lastUpdated: serverTimestamp(),
                ...userData
            });
            console.log('Existing user updated:', userId);
            return userDoc.data();
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
};

// Get user document with migration logic
export const getUserDocument = async (userId) => {
    try {
        console.log('getUserDocument: Called with userId:', userId);
        
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            console.log('getUserDocument: User document does not exist');
            return null;
        }
        
        const userData = userDoc.data();
        console.log('getUserDocument: User data fetched:', userData);
        
        // Migration logic: if user has old readingLimit field, migrate to new system
        if (userData.readingLimit !== undefined && userData.weeklyReadingLimit === undefined) {
            console.log('getUserDocument: Migrating user from old readingLimit system');
            
            try {
                await updateDoc(userRef, {
                    weeklyReadingLimit: 7,
                    weeklyReadingsUsed: 0,
                    lastWeekReset: getWeekStart(),
                    readingLimit: deleteField() // Remove old field
                });
                console.log('getUserDocument: Migration completed successfully');
                
                // Update local data
                userData.weeklyReadingLimit = 7;
                userData.weeklyReadingsUsed = 0;
                userData.lastWeekReset = getWeekStart();
                delete userData.readingLimit;
            } catch (migrationError) {
                console.error('getUserDocument: Migration failed:', migrationError);
                // Continue with existing data if migration fails
            }
        }
        
        return userData;
    } catch (error) {
        console.error('Error getting user document:', error);
        throw error;
    }
};

// Check if user is premium
export const isUserPremium = (userData) => {
    if (!userData) return false;
    
    // Check if user has premium subscription
    if (userData.isPremium === true) {
        return true;
    }
    
    // Check if user has active subscription data
    if (userData.subscription && userData.subscription.status) {
        return ['active', 'trialing'].includes(userData.subscription.status);
    }
    
    return false;
};

// Update user subscription status
export const updateUserSubscription = async (userId, subscriptionData) => {
    try {
        const userRef = doc(db, 'users', userId);
        
        await updateDoc(userRef, {
            subscription: subscriptionData,
            isPremium: subscriptionData.status === 'active' || subscriptionData.status === 'trialing',
            weeklyReadingLimit: (subscriptionData.status === 'active' || subscriptionData.status === 'trialing') ? 21 : 7,
            lastSubscriptionCheck: serverTimestamp(),
            lastUpdated: serverTimestamp()
        });
        
        console.log('User subscription updated:', userId, subscriptionData.status);
    } catch (error) {
        console.error('Error updating user subscription:', error);
        throw error;
    }
};

// Create subscription history record
export const createSubscriptionRecord = async (subscriptionData) => {
  try {
    const subscriptionRef = await addDoc(collection(db, 'subscriptions'), {
      userId: subscriptionData.userId,
      stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
      status: subscriptionData.status,
      tier: subscriptionData.tier,
      amount: subscriptionData.amount,
      currency: subscriptionData.currency,
      interval: subscriptionData.interval,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      canceledAt: subscriptionData.canceledAt || null,
      paymentHistory: subscriptionData.paymentHistory || [],
      createdAt: serverTimestamp()
    });

    console.log('Subscription record created:', subscriptionRef.id);
    return subscriptionRef.id;
  } catch (error) {
    console.error('Error creating subscription record:', error);
    throw error;
  }
};

// Get user's remaining weekly readings
export const getUserRemainingWeeklyReadings = async (userId) => {
    try {
        console.log('getUserRemainingWeeklyReadings: Called with userId:', userId);
        
        const userData = await getUserDocument(userId);
        console.log('getUserRemainingWeeklyReadings: User data fetched:', userData);
        
        if (!userData) {
            console.log('getUserRemainingWeeklyReadings: No user data found, returning 0');
            return 0;
        }

        if (isUserPremium(userData)) {
            console.log('getUserRemainingWeeklyReadings: User is premium, returning 21');
            return 21; // Premium users get 21 readings per week
        }

        // Check if we need to reset weekly readings
        const now = new Date();
        const lastReset = userData.lastWeekReset?.toDate() || new Date(0);
        const weekStart = getWeekStart();
        
        console.log('getUserRemainingWeeklyReadings: Last reset:', lastReset);
        console.log('getUserRemainingWeeklyReadings: Current week start:', weekStart);
        
        if (lastReset < weekStart) {
            console.log('getUserRemainingWeeklyReadings: Week has changed, resetting readings');
            // Week has changed, reset readings
            await updateDoc(doc(db, 'users', userId), {
                weeklyReadingsUsed: 0,
                lastWeekReset: weekStart
            });
            return 7; // Fresh week, all readings available
        }
        
        const remaining = Math.max(0, 7 - (userData.weeklyReadingsUsed || 0));
        console.log('getUserRemainingWeeklyReadings: Remaining readings:', remaining);
        return remaining;
        
    } catch (error) {
        console.error('Error getting remaining weekly readings:', error);
        return 0;
    }
};

// Increment weekly readings count
export const incrementWeeklyReadings = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userData = await getDoc(userRef);
        
        if (!userData.exists()) {
            console.error('User not found for incrementing readings:', userId);
            return;
        }
        
        const currentData = userData.data();
        const currentUsed = currentData.weeklyReadingsUsed || 0;
        
        await updateDoc(userRef, {
            weeklyReadingsUsed: currentUsed + 1,
            lastUpdated: serverTimestamp()
        });
        
        console.log('Weekly readings incremented for user:', userId, 'New total:', currentUsed + 1);
    } catch (error) {
        console.error('Error incrementing weekly readings:', error);
    }
};

// Legacy function for backward compatibility
export const getUserRemainingReadings = async (userId) => {
    return await getUserRemainingWeeklyReadings(userId);
};

// Get user's reading history for statistics
export const getUserReadingStats = async (userId) => {
    try {
        const readingsRef = collection(db, 'readings');
        const q = query(
            readingsRef,
            where('userId', '==', userId),
            where('timestamp', '>=', new Date(new Date().getFullYear(), new Date().getMonth(), 1))
        );
        
        const querySnapshot = await getDocs(q);
        const readings = querySnapshot.docs.map(doc => doc.data());
        
        return {
            totalReadings: readings.length,
            thisMonthCount: readings.length,
            lastReadingDate: readings.length > 0 ? readings[readings.length - 1].timestamp : null
        };
    } catch (error) {
        console.error('Error getting user reading stats:', error);
        return {
            totalReadings: 0,
            thisMonthCount: 0,
            lastReadingDate: null
        };
    }
};

// Get user's favorite reading type
export const getFavoriteReadingType = async (userId) => {
    try {
        const readingsRef = collection(db, 'readings');
        const q = query(
            readingsRef,
            where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(q);
        const readings = querySnapshot.docs.map(doc => doc.data());
        
        if (readings.length === 0) return 'No readings yet';
        
        // Count reading types
        const typeCounts = {};
        readings.forEach(reading => {
            const type = reading.readingType || 'unknown';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        // Find most common type
        const favoriteType = Object.entries(typeCounts).reduce((a, b) => 
            typeCounts[a[0]] > typeCounts[b[0]] ? a : b
        )[0];
        
        // Map type numbers to readable names
        const typeNames = {
            '1': 'Past/Present/Future',
            '2': 'Action/Outcome',
            '3': 'Relationship Review',
            '4': 'Career Path',
            '5': 'Daily Insight',
            '6': 'Weekly Insight',
            '7': 'General Reading'
        };
        
        return typeNames[favoriteType] || favoriteType;
    } catch (error) {
        console.error('Error getting favorite reading type:', error);
        return 'Unknown';
    }
};
