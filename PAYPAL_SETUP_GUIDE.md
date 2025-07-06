# PayPal Integration Setup Guide

## Current Issue
The PayPal integration is failing due to authentication errors. This means the PayPal credentials need to be obtained from the PayPal Developer Console.

## Solution: Get PayPal Sandbox Credentials

### Step 1: Create PayPal Developer Account
1. Go to https://developer.paypal.com/
2. Sign in with your PayPal account (or create one if needed)
3. Accept the developer agreement

### Step 2: Create a Sandbox Application
1. Click "Create App" on the developer dashboard
2. Fill in the details:
   - **App Name**: SolarPak Donation Platform
   - **Merchant**: Select your sandbox business account (or create one)
   - **Features**: Check "Accept payments"
   - **Environment**: Select "Sandbox" for testing

### Step 3: Get Your Credentials
1. After creating the app, you'll see your credentials:
   - **Client ID**: Copy this value
   - **Client Secret**: Copy this value (you may need to click "Show" to reveal it)

### Step 4: Update Replit Secrets
1. In your Replit project, go to the "Secrets" tab
2. Update these environment variables:
   - `PAYPAL_CLIENT_ID`: Your sandbox Client ID
   - `PAYPAL_CLIENT_SECRET`: Your sandbox Client Secret

## Important Notes

### Sandbox vs Live Environment
- **Sandbox**: Use for testing with fake money
- **Live**: Use for real transactions (requires additional verification)

### Current Configuration
The system is configured to use:
- **Sandbox environment** for development
- **Live environment** for production (when NODE_ENV=production)

### Testing Payments
With sandbox credentials, you can:
- Use fake PayPal accounts for testing
- Process test payments without real money
- Test the complete donation flow

## Common Issues

### Authentication Failed (401 Error)
- Double-check your Client ID and Client Secret
- Ensure you're using sandbox credentials for testing
- Make sure there are no extra spaces in the credentials

### Invalid Client Error
- Verify the credentials are from the correct PayPal app
- Check that the app has "Accept payments" feature enabled
- Ensure you're using the right environment (sandbox/live)

## Need Help?
If you continue having issues:
1. Double-check the credentials from PayPal Developer Console
2. Try creating a new app in PayPal Developer Console
3. Make sure you're copying the full Client ID and Client Secret values