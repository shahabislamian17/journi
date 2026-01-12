'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Prompt() {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [selectedActions, setSelectedActions] = useState(new Set());
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Get bookings from sessionStorage
    if (typeof window !== 'undefined') {
      const bookingsStr = sessionStorage.getItem('confirmedBookings');
      if (bookingsStr) {
        try {
          const parsed = JSON.parse(bookingsStr);
          setBookings(parsed);
        } catch (e) {
          console.error('Error parsing bookings:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (stripeLoaded && typeof window !== 'undefined' && window.Stripe) {
      const initializeConfirmation = async () => {
        const params = new URLSearchParams(window.location.search);
        const piSecret = params.get('payment_intent_client_secret');
        const buttons = document.querySelectorAll('[data-button="1A"][data-action]');
        let paymentIntentId = sessionStorage.getItem('stripe_payment_intent_id');
        const customerId = sessionStorage.getItem('stripe_customer_id');

        // If no paymentIntentId in sessionStorage, try to get from URL
        if (!paymentIntentId && piSecret) {
          const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';
          
          // Validate that it's a publishable key (starts with pk_), not a secret key
          if (!stripePublishableKey.startsWith('pk_')) {
            console.error('Invalid Stripe key: Must be a publishable key (pk_test_... or pk_live_...), not a secret key (sk_test_... or sk_live_...)');
            console.error('Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your Vercel environment variables with a publishable key from Stripe Dashboard.');
            return;
          }
          
          const stripe = window.Stripe(stripePublishableKey);
          const { paymentIntent, error } = await stripe.retrievePaymentIntent(piSecret);
          if (!error && paymentIntent && paymentIntent.id) {
            paymentIntentId = paymentIntent.id;
            sessionStorage.setItem('stripe_payment_intent_id', paymentIntentId);
          }
        }

        if (!paymentIntentId) {
          console.warn('PaymentIntent not found.');
          return;
        }

        const UNIT_AMOUNT = 10000; // £100.00 per booking
        const selectable = new Set(['1', '2', '3', '4', '5']);
        const selected = new Set();

        buttons.forEach((button) => {
          const action = button.getAttribute('data-action');
          const link = button.querySelector('a.action');
          if (!link) {
            return;
          }

          if (selectable.has(action)) {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              if (link.getAttribute('aria-disabled') === 'true') {
                return;
              }

              if (selected.has(action)) {
                selected.delete(action);
                button.classList.remove('selected');
                button.querySelector('.text').textContent = '€100';
                setSelectedActions(new Set(selected));
              } else {
                selected.add(action);
                button.classList.add('selected');
                button.querySelector('.text').textContent = 'Charge €100';
                setSelectedActions(new Set(selected));
              }
            });
            return;
          }

          if (action === '6') {
            link.addEventListener('click', async (e) => {
              e.preventDefault();
              if (selected.size === 0) {
                alert('Please select at least one booking.');
                return;
              }

              const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
              const payload = {
                actions: Array.from(selected),
                paymentIntentId: paymentIntentId,
                customerId: customerId
              };

              try {
                const res = await fetch(`${API_URL}/api/stripe/payment`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (data.error) {
                  alert(data.error);
                  return;
                }

                // Update UI for captured bookings
                selected.forEach((a) => {
                  const btn = document.querySelector(`[data-button="1A"][data-action="${a}"]`);
                  if (btn) {
                    const aEl = btn.querySelector('a.action');
                    btn.querySelector('.text').textContent = 'Charged €100';
                    if (aEl) {
                      aEl.setAttribute('aria-disabled', 'true');
                      aEl.style.pointerEvents = 'none';
                    }
                    btn.classList.remove('selected');
                    btn.classList.add('disabled');
                  }
                });

                selected.clear();
                setSelectedActions(new Set());
              } catch (error) {
                console.error('Error capturing payment:', error);
                alert('Error capturing payment. Please try again.');
              }
            });
          }
        });
      };

      initializeConfirmation();
    }
  }, [stripeLoaded]);

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        onLoad={() => setStripeLoaded(true)}
        strategy="lazyOnload"
      />
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h1 className="one">Ibiza is calling.</h1>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="text">
                    <p>Duis aute irure dolor in officia reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sinte.</p>
                  </div>
                </div>
                <div className="block" data-block="3">
                  <div className="buttons">
                    {bookings.length > 0 && bookings.slice(0, 5).map((booking, idx) => (
                      <div key={booking.id || idx} className="button medium" data-button="1A" data-action={idx + 1}>
                        <a className="action" href="#">
                          <div className="text">€100</div>
                        </a>
                      </div>
                    ))}
                    <div className="button medium" data-button="1A" data-action="6">
                      <a className="action" href="#">
                        <div className="text">Capture</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section two">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="images">
                    <div className="image" style={{ backgroundImage: "url('/assets/images/global/banners/banner-1.jpg')" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
