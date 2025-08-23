# Stripe Premium Subscription Setup Guide

## Overview
This system automatically handles premium subscriptions through Stripe, including:
- 3-day free trial for new subscribers
- Automatic premium status updates
- Daily subscription verification
- Automatic downgrade when payments fail or subscriptions end

## Prerequisites
1. Stripe account with access to the dashboard
2. Firebase project with Cloud Functions enabled
3. Environment variables configured

## Environment Variables Required

### In Firebase Functions (functions/.env)
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### In React App (.env.local)
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Stripe Dashboard Setup

### 1. Create Product and Price
1. Go to Stripe Dashboard → Products
2. Create a new product called "Premium Tarot Readings"
3. Add a recurring price:
   - Amount: $9.99 (or your desired price)
   - Billing: Monthly
   - Trial period: 3 days
   - Trial settings: Allow trial

### 2. Configure Webhook Endpoint
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-region-your-project.cloudfunctions.net/stripeWebhook`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Update Stripe Buy Button
In your AccountPage.js, update the Stripe button data:
```javascript
data-sku="your_price_id_here"
```

## Deployment Steps

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Deploy Functions
```bash
firebase deploy --only functions
```

### 3. Test Webhook
1. Use Stripe CLI to test webhooks locally
2. Verify webhook endpoint is accessible
3. Check Firebase Functions logs for webhook events

## How It Works

### Subscription Flow
1. User clicks Stripe button → Creates Stripe customer with userId metadata
2. Stripe processes payment → Sends webhook to Firebase Function
3. Function updates user document → Sets `isPremium: true` and `weeklyReadingLimit: 21`
4. User immediately gets premium access

### Trial Period
- New subscribers get 3 days free
- During trial: `subscription.status = 'trialing'`
- After trial: Stripe attempts first payment
- If payment fails: User downgraded to free

### Daily Verification
- `checkSubscriptionStatus` function runs daily at midnight UTC
- Verifies all premium users still have active subscriptions
- Downgrades users with expired or failed subscriptions
- Updates subscription period information

### Automatic Downgrade
Users are automatically downgraded to free when:
- Subscription is canceled
- Payment fails after trial
- Subscription period expires
- Webhook indicates subscription deletion

## Testing

### Test Functions
```bash
# Test webhook endpoint
curl -X POST https://your-region-your-project.cloudfunctions.net/testFunction

# Test subscription check
curl "https://your-region-your-project.cloudfunctions.net/checkUserSubscription?userId=test_user_id"
```

### Test Scenarios
1. **New Subscription**: Create test subscription, verify user gets premium
2. **Trial End**: Wait for trial to end, verify payment processing
3. **Payment Failure**: Use test card that fails, verify downgrade
4. **Cancellation**: Cancel subscription, verify downgrade

## Monitoring

### Firebase Functions Logs
```bash
firebase functions:log
```

### Stripe Dashboard
- Monitor subscription status
- Check webhook delivery
- View payment history

### User Status Tracking
- `subscriptionHistory` collection tracks all changes
- `lastSubscriptionCheck` field shows last verification
- `isPremium` field indicates current status

## Troubleshooting

### Common Issues
1. **Webhook not receiving events**: Check endpoint URL and webhook secret
2. **User not getting premium**: Verify webhook events are being processed
3. **Functions not deploying**: Check Node.js version and dependencies
4. **Environment variables missing**: Verify .env file in functions directory

### Debug Steps
1. Check Firebase Functions logs
2. Verify Stripe webhook endpoint configuration
3. Test webhook with Stripe CLI
4. Check user document updates in Firestore

## Security Notes
- Webhook signature verification prevents spoofing
- User ID metadata links Stripe customers to Firebase users
- All subscription changes are logged for audit
- Automatic verification prevents manual manipulation

## Cost Considerations
- Firebase Functions: Pay per invocation
- Stripe: Standard transaction fees
- Firestore: Document reads/writes for subscription tracking
- Monitor usage to optimize costs
