const paypal = require("paypal-rest-sdk");

// Configure PayPal with your credentials
paypal.configure({
  mode: "sandbox", // 'sandbox' for testing or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});
