/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 *
 * const { onRequest } = require("firebase-functions/v2/https");
 * const logger = require("firebase-functions/logger");
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

// Initialize Firebase Admin
admin.initializeApp();

// Get Firestore database reference
const db = admin.firestore();

// Stripe webhook handler
exports.stripeWebhook = functions.https.onRequest(async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = functions.config().stripe.webhook_secret;
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(request.rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    try {
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            case 'customer.subscription.trial_will_end':
                await handleTrialEnding(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        
        response.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        response.status(500).send('Internal server error');
    }
});

// Helper function to handle subscription creation
async function handleSubscriptionCreated(subscription) {
    try {
        const customerId = subscription.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.userId;
        
        if (userId) {
            await db.collection('users').doc(userId).update({
                isPremium: true,
                weeklyReadingLimit: 21,
                subscription: {
                    id: subscription.id,
                    status: subscription.status,
                    current_period_end: new Date(subscription.current_period_end * 1000),
                    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
                }
            });
            console.log(`User ${userId} upgraded to premium`);
        }
    } catch (error) {
        console.error('Error handling subscription creation:', error);
    }
}

// Helper function to handle subscription updates
async function handleSubscriptionUpdated(subscription) {
    try {
        const customerId = subscription.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.userId;
        
        if (userId) {
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';
            await db.collection('users').doc(userId).update({
                isPremium: isActive,
                weeklyReadingLimit: isActive ? 21 : 7,
                subscription: {
                    id: subscription.id,
                    status: subscription.status,
                    current_period_end: new Date(subscription.current_period_end * 1000),
                    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
                }
            });
            console.log(`User ${userId} subscription updated: ${subscription.status}`);
        }
    } catch (error) {
        console.error('Error handling subscription update:', error);
    }
}

// Helper function to handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
    try {
        const customerId = subscription.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.userId;
        
        if (userId) {
            await db.collection('users').doc(userId).update({
                isPremium: false,
                weeklyReadingLimit: 7,
                subscription: admin.firestore.FieldValue.delete()
            });
            console.log(`User ${userId} downgraded to free`);
        }
    } catch (error) {
        console.error('Error handling subscription deletion:', error);
    }
}

// Helper function to handle successful payments
async function handlePaymentSucceeded(invoice) {
    try {
        if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            const customerId = subscription.customer;
            const customer = await stripe.customers.retrieve(customerId);
            const userId = customer.metadata.userId;
            
            if (userId) {
                await db.collection('users').doc(userId).update({
                    isPremium: true,
                    weeklyReadingLimit: 21
                });
                console.log(`Payment succeeded for user ${userId}`);
            }
        }
    } catch (error) {
        console.error('Error handling payment success:', error);
    }
}

// Helper function to handle failed payments
async function handlePaymentFailed(invoice) {
    try {
        if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            const customerId = subscription.customer;
            const customer = await stripe.customers.retrieve(customerId);
            const userId = customer.metadata.userId;
            
            if (userId) {
                await db.collection('users').doc(userId).update({
                    isPremium: false,
                    weeklyReadingLimit: 7
                });
                console.log(`Payment failed for user ${userId}, downgraded to free`);
            }
        }
    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}

// Helper function to handle trial ending
async function handleTrialEnding(subscription) {
    try {
        const customerId = subscription.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.userId;
        
        if (userId) {
            // Send notification or take action before trial ends
            console.log(`Trial ending soon for user ${userId}`);
        }
    } catch (error) {
        console.error('Error handling trial ending:', error);
    }
}

// Scheduled function to check subscription status daily
exports.checkSubscriptionStatus = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    try {
        console.log('Running daily subscription status check...');
        
        // Get all premium users
        const premiumUsers = await db.collection('users')
            .where('isPremium', '==', true)
            .get();
        
        for (const userDoc of premiumUsers.docs) {
            const userData = userDoc.data();
            if (userData.subscription && userData.subscription.id) {
                try {
                    const subscription = await stripe.subscriptions.retrieve(userData.subscription.id);
                    
                    // Check if subscription is still active
                    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
                        // Downgrade user to free
                        await userDoc.ref.update({
                            isPremium: false,
                            weeklyReadingLimit: 7,
                            subscription: admin.firestore.FieldValue.delete()
                        });
                        console.log(`User ${userDoc.id} downgraded due to inactive subscription`);
                    }
                } catch (error) {
                    console.error(`Error checking subscription for user ${userDoc.id}:`, error);
                    
                    // If we can't retrieve the subscription, downgrade the user
                    await userDoc.ref.update({
                        isPremium: false,
                        weeklyReadingLimit: 7,
                        subscription: admin.firestore.FieldValue.delete()
                    });
                    console.log(`User ${userDoc.id} downgraded due to subscription retrieval error`);
                }
            }
        }
        
        console.log('Daily subscription status check completed');
        return null;
    } catch (error) {
        console.error('Error in daily subscription check:', error);
        return null;
    }
});

// Manual subscription check function
exports.checkUserSubscription = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }
        
        const userId = context.auth.uid;
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User not found');
        }
        
        const userData = userDoc.data();
        
        if (userData.subscription && userData.subscription.id) {
            const subscription = await stripe.subscriptions.retrieve(userData.subscription.id);
            return {
                isPremium: subscription.status === 'active' || subscription.status === 'trialing',
                subscriptionStatus: subscription.status
            };
        }
        
        return { isPremium: false, subscriptionStatus: 'none' };
    } catch (error) {
        console.error('Error checking user subscription:', error);
        throw new functions.https.HttpsError('internal', 'Error checking subscription status');
    }
});

// Test function
exports.testFunction = functions.https.onRequest((request, response) => {
    response.json({ message: 'Firebase Functions are working!' });
});
