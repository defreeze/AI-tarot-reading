#!/bin/bash

echo "🚀 Deploying Stripe Premium Subscription System"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "functions/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing Firebase Functions dependencies..."
cd functions
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found in functions directory"
    echo "   Please create functions/.env with:"
    echo "   STRIPE_SECRET_KEY=your_stripe_secret_key"
    echo "   STRIPE_WEBHOOK_SECRET=your_webhook_secret"
    echo ""
    read -p "Continue with deployment? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo "🚀 Deploying Firebase Functions..."
firebase deploy --only functions

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure Stripe webhook endpoint in your Stripe dashboard"
    echo "2. Set environment variables in your React app (.env.local):"
    echo "   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_publishable_key"
    echo "   REACT_APP_STRIPE_PRICE_ID=your_price_id"
    echo "3. Test the subscription flow"
    echo ""
    echo "🔗 Webhook URL: https://your-region-your-project.cloudfunctions.net/stripeWebhook"
    echo "📖 See STRIPE_SETUP.md for detailed configuration instructions"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
