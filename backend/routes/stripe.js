const express = require('express');
const Stripe = require('stripe');

const router = express.Router();

// Initialize Stripe with secret key from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here');

// Create PaymentIntent and Customer
router.post('/setup', async (req, res) => {
  try {
    // Clean output buffer
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-store');

    const { mode, first_name, surname, email, phone, user_ref, customer_id } = req.body;

    if (mode !== 'create_payment_intent') {
      return res.status(400).json({ error: 'Invalid mode.' });
    }

    const firstName = (first_name || '').trim();
    const lastName = (surname || '').trim();
    const userEmail = email || null;
    const userPhone = phone || null;
    const userRef = user_ref || 'guest';
    const incomingCustomerId = (customer_id || '').trim();

    let customer = null;

    // Try to retrieve existing customer if ID provided
    if (incomingCustomerId) {
      try {
        customer = await stripe.customers.retrieve(incomingCustomerId);
        if (customer.deleted) {
          customer = null;
        }
      } catch (e) {
        customer = null;
      }
    }

    // Create new customer if doesn't exist
    if (!customer) {
      customer = await stripe.customers.create({
        name: `${firstName} ${lastName}`.trim() || null,
        email: userEmail,
        phone: userPhone,
        metadata: {
          user_ref: userRef
        }
      });
    }

    // Create PaymentIntent
    // Note: Amount should be calculated from bag items, for now using 50000 (500.00)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50000, // TODO: Calculate from bag items
      currency: 'gbp',
      customer: customer.id,
      capture_method: 'manual',
      automatic_payment_methods: {
        enabled: true
      },
      description: 'Booking',
      metadata: {
        booking_total: '500'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id
    });
  } catch (error) {
    console.error('Stripe setup error:', error);
    res.status(500).json({ error: 'Payment error.' });
  }
});

// Capture payment and create transfers
router.post('/payment', async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-store');

    const { actions, paymentIntentId, customerId } = req.body;

    if (!actions || !Array.isArray(actions) || actions.length === 0 || !paymentIntentId) {
      return res.status(400).json({ error: 'Missing parameters.' });
    }

    // Valid action IDs (booking IDs)
    const validActions = ['1', '2', '3', '4', '5'];
    const filteredActions = [];
    for (const a of actions) {
      const actionStr = String(a);
      if (validActions.includes(actionStr) && !filteredActions.includes(actionStr)) {
        filteredActions.push(actionStr);
      }
    }

    if (filteredActions.length === 0) {
      return res.status(400).json({ error: 'No valid actions to capture.' });
    }

    const unitAmount = 10000; // £100.00 per booking
    const totalAmount = filteredActions.length * unitAmount;

    // Retrieve PaymentIntent
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid PaymentIntent.' });
    }

    // Check if payment is in correct state
    if (paymentIntent.status !== 'requires_capture') {
      return res.status(409).json({ 
        error: 'Payment is not in an authorisation state.' 
      });
    }

    // Get charge ID
    const chargeId = paymentIntent.latest_charge || 
      (paymentIntent.charges?.data?.[0]?.id) || null;

    if (!chargeId) {
      return res.status(500).json({ 
        error: 'Authorisation charge not found. Please complete checkout authentication and try again.' 
      });
    }

    // Capture the payment
    try {
      await stripe.paymentIntents.capture(paymentIntentId, {
        amount_to_capture: totalAmount
      });
    } catch (e) {
      return res.status(500).json({ 
        error: `Capture error: ${e.message}` 
      });
    }

    // Create transfers to connected accounts
    // TODO: Map booking IDs to Stripe account IDs from database
    const accounts = {
      '1': 'acct_1SFO2vLS7I7n2wbA',
      '2': 'acct_1SFO5gLrbVq79EiY',
      '3': 'acct_1SFO7qLueroixfhe',
      '4': 'acct_1SFO9mL6S6fpd0u2',
      '5': 'acct_1SFODgLnJq9425DI'
    };

    const transfers = [];
    const failed = [];

    for (const action of filteredActions) {
      const destination = accounts[action];
      if (!destination) {
        failed.push(action);
        continue;
      }

      try {
        const transfer = await stripe.transfers.create({
          amount: unitAmount,
          currency: 'gbp',
          destination: destination,
          transfer_group: `booking:action:${action}`,
          metadata: {
            action: action
          }
        });

        transfers.push({
          action: action,
          transfer: transfer.id
        });
      } catch (e) {
        failed.push(action);
      }
    }

    res.json({
      ok: true,
      captured: totalAmount,
      transfers: transfers,
      failed: failed
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

module.exports = router;

