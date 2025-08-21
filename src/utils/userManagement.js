import { doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Create or update user document in Firestore
export const createOrUpdateUser = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        accountStatus: 'free', // Default to free account
        subscriptionTier: 'basic', // Default tier
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        lastPaymentDate: null,
        paymentMethod: null,
        autoRenew: false,
        readingLimit: 2, // Free users get 2 readings per day
        historyAccess: 'limited', // Free users see only 3 most recent readings
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userRef, userData);
      console.log('New user document created:', user.uid);
      return userData;
    } else {
      // Update existing user document with any new info
      const updateData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, updateData);
      console.log('Existing user document updated:', user.uid);
      return { ...userDoc.data(), ...updateData };
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

// Get user document from Firestore
export const getUserDocument = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('User document not found:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

// Update user's subscription status
export const updateUserSubscription = async (userId, subscriptionData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const updateData = {
      accountStatus: subscriptionData.accountStatus,
      subscriptionTier: subscriptionData.subscriptionTier,
      subscriptionStartDate: subscriptionData.subscriptionStartDate,
      subscriptionEndDate: subscriptionData.subscriptionEndDate,
      lastPaymentDate: subscriptionData.lastPaymentDate,
      readingLimit: subscriptionData.readingLimit,
      historyAccess: subscriptionData.historyAccess,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);
    console.log('User subscription updated:', userId);
    
    return updateData;
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

// Check if user has active premium subscription
export const isUserPremium = (userData) => {
  if (!userData || userData.accountStatus !== 'premium') {
    return false;
  }

  if (!userData.subscriptionEndDate) {
    return false;
  }

  const now = new Date();
  const subscriptionEnd = userData.subscriptionEndDate.toDate();
  
  return subscriptionEnd > now;
};

// Get user's remaining readings for today
export const getUserRemainingReadings = (userData) => {
  if (isUserPremium(userData)) {
    return 'unlimited';
  }
  
  // For free users, this would need to be calculated based on actual readings today
  // For now, return the daily limit
  return userData.readingLimit || 2;
};
