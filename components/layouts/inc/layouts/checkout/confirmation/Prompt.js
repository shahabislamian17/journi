'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { bagAPI } from '../../../../../../lib/bag';
import { bookingsAPI, authAPI } from '../../../../../../lib/api';

export default function Prompt() {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [selectedActions, setSelectedActions] = useState(new Set());
  const [bookings, setBookings] = useState([]);
  const [bookingsCreated, setBookingsCreated] = useState(false);

  // Remove sensitive data from URL immediately on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const piSecret = params.get('payment_intent_client_secret');
      
      if (piSecret) {
        // Extract payment intent ID from client secret (format: pi_xxx_secret_yyy)
        // The payment intent ID is everything before '_secret_'
        // Split on '_secret_' and take the first part
        const secretParts = piSecret.split('_secret_');
        if (secretParts.length > 0 && secretParts[0] && secretParts[0].startsWith('pi_')) {
          const paymentIntentId = secretParts[0];
          // Store payment intent ID in sessionStorage (never store the full client secret)
          sessionStorage.setItem('stripe_payment_intent_id', paymentIntentId);
        }
        
        // Remove the client secret from URL immediately for security
        // This prevents it from being stored in browser history, server logs, or being shared
        params.delete('payment_intent_client_secret');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  useEffect(() => {
    // Get bookings from sessionStorage (in case they were already created)
    if (typeof window !== 'undefined') {
      const bookingsStr = sessionStorage.getItem('confirmedBookings');
      if (bookingsStr) {
        try {
          const parsed = JSON.parse(bookingsStr);
          setBookings(parsed);
          setBookingsCreated(true); // Mark as created if they already exist
        } catch (e) {
          console.error('Error parsing bookings:', e);
        }
      }
    }
  }, []);

  // Create bookings from bag items after payment confirmation
  useEffect(() => {
    const createBookingsFromBag = async () => {
      if (bookingsCreated) return; // Prevent duplicate creation
      
      const paymentIntentId = sessionStorage.getItem('stripe_payment_intent_id');
      const bagItemsStr = sessionStorage.getItem('checkout_bag_items');
      const formDataStr = sessionStorage.getItem('checkout_form_data');
      
      if (!paymentIntentId || !bagItemsStr) {
        console.warn('Missing payment intent or bag items');
        return;
      }

      try {
        const bagItems = JSON.parse(bagItemsStr);
        const formData = formDataStr ? JSON.parse(formDataStr) : {};
        
        if (!bagItems || bagItems.length === 0) {
          console.warn('No bag items to create bookings');
          return;
        }

        // Get or create user token
        let token = localStorage.getItem('token');
        
        // If user is not logged in but provided password, try to login/register
        if (!token && formData.email && formData.password) {
          try {
            // Try to login first
            const loginResponse = await authAPI.login({
              email: formData.email,
              password: formData.password
            });
            
            if (loginResponse.token) {
              token = loginResponse.token;
              localStorage.setItem('token', token);
              document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }
          } catch (loginError) {
            // If login fails, try to register
            try {
              const registerResponse = await authAPI.register({
                firstName: formData.firstName,
                lastName: formData.surname,
                email: formData.email,
                password: formData.password,
                role: 'TRAVELLER'
              });
              
              if (registerResponse.token) {
                token = registerResponse.token;
                localStorage.setItem('token', token);
                document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
              }
            } catch (registerError) {
              console.error('Failed to register user:', registerError);
              // Continue without token - bookings will fail but we tried
            }
          }
        }

        if (!token) {
          console.error('No authentication token available. User must be logged in to create bookings.');
          alert('Please log in to complete your booking. Your payment was successful but bookings could not be created.');
          return;
        }

        // Create bookings for each bag item
        const createdBookings = [];
        for (const item of bagItems) {
          try {
            const bookingData = {
              experienceId: item.experienceId,
              date: item.date,
              guests: item.guests || 1,
              totalPrice: item.totalPrice || item.price || 0,
              paymentIntentId: paymentIntentId
            };

            const bookingResponse = await bookingsAPI.create(bookingData, { token });
            if (bookingResponse.booking) {
              createdBookings.push(bookingResponse.booking);
            }
          } catch (error) {
            console.error(`Failed to create booking for item ${item.id}:`, error);
            // Continue with other items even if one fails
          }
        }

        if (createdBookings.length > 0) {
          // Store created bookings in sessionStorage for display
          sessionStorage.setItem('confirmedBookings', JSON.stringify(createdBookings));
          setBookings(createdBookings);
          
          // Clear bag after successful booking creation
          bagAPI.clear();
          
          // Clear checkout data from sessionStorage
          sessionStorage.removeItem('checkout_bag_items');
          sessionStorage.removeItem('checkout_form_data');
          
          setBookingsCreated(true);
          console.log(`✅ Successfully created ${createdBookings.length} booking(s)`);
          
          // Show success message (optional - can be removed if not needed)
          // The bookings will be displayed in the UI below
        } else {
          console.error('No bookings were created');
          // Don't show alert if payment was successful - just log the error
          // User can contact support if needed
          console.error('Payment was successful but bookings could not be created. Please contact support with your payment confirmation.');
        }
      } catch (error) {
        console.error('Error creating bookings:', error);
        alert('Error creating bookings. Please contact support with your payment confirmation.');
      }
    };

    // Only create bookings once when component mounts and payment is confirmed
    if (typeof window !== 'undefined') {
      createBookingsFromBag();
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (stripeLoaded && typeof window !== 'undefined' && window.Stripe) {
      const initializeConfirmation = async () => {
        const buttons = document.querySelectorAll('[data-button="1A"][data-action]');
        const paymentIntentId = sessionStorage.getItem('stripe_payment_intent_id');
        const customerId = sessionStorage.getItem('stripe_customer_id');

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
