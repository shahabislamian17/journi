'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { bagAPI } from '../../../../../lib/bag';

export default function Checkout() {
  const router = useRouter();
  const [bagItems, setBagItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phoneNumber: '',
    password: '',
    agreeToTerms: false,
  });
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [paymentEl, setPaymentEl] = useState(null);
  const stripeContainerRef = useRef(null);
  const placeButtonRef = useRef(null);

  useEffect(() => {
    // Load bag items on mount
    const loadBagItems = () => {
      const items = bagAPI.getAll();
      if (items.length === 0) {
        router.push('/');
        return;
      }
      setBagItems(items);
      setSubtotal(bagAPI.getSubtotal());
    };

    loadBagItems();

    const handleBagUpdate = () => {
      loadBagItems();
    };

    window.addEventListener('bagUpdated', handleBagUpdate);
    return () => {
      window.removeEventListener('bagUpdated', handleBagUpdate);
    };
  }, [router]);

  // Load user data if logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || '',
            surname: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phone || '',
          }));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  // Initialize Stripe when script loads - matching PHP flow exactly
  useEffect(() => {
    if (stripeLoaded && stripeContainerRef.current && typeof window !== 'undefined' && window.Stripe) {
      const initializeStripe = async () => {
        try {
          const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';
          const stripeInstance = window.Stripe(stripePublishableKey);
          const isMobile = document.documentElement.classList.contains('mobile');
          
          const appearance = {
            theme: 'stripe',
            variables: {
              borderRadius: '11px',
              colorBackground: '#FFFFFF',
              colorDanger: '#101820',
              colorPrimary: '#101820',
              colorText: '#101820',
              fontFamily: 'InterVariable, sans-serif',
              fontSizeBase: '15px',
              gridColumnSpacing: '12px',
              gridRowSpacing: '12px'
            },
            rules: {
              '.Input': {
                border: '1px solid #ECECEC',
                boxShadow: 'none',
                fontSize: '0.8625em',
                fontVariationSettings: '"opsz" 22',
                fontWeight: '450',
                letterSpacing: '-0.0125em',
                lineHeight: '1.3375em',
                paddingLeft: '14px',
                textTransform: 'capitalize'
              },
              '.Input:hover': {
                boxShadow: 'none'
              },
              '.Input:focus': {
                border: '1px solid #757576',
                boxShadow: 'none'
              },
              '.Input--invalid': {
                border: '1px solid #757576',
                boxShadow: 'none'
              },
              '.Input--disabled': {
                border: '1px solid #757576',
                boxShadow: 'none'
              },
              '.Label': {
                textTransform: 'capitalize'
              },
              '.Label--resting': {
                fontSize: '0.8625em',
                fontVariationSettings: '"opsz" 22',
                fontWeight: '425',
                letterSpacing: '-0.0125em'
              },
              '.Label--floating': {
                fontSize: '0.7em',
                fontVariationSettings: '"opsz" 22',
                fontWeight: '425',
                letterSpacing: '-0.0125em',
                top: '1px'
              },
              '.Error': {
                fontSize: '0.75em',
                fontVariationSettings: '"opsz" 22',
                fontWeight: '405',
                letterSpacing: '-0.01325em',
                margin: '8px 0 6px 1px'
              },
              '.TermsText': {
                color: '#101820',
                fontSize: '0',
                margin: '0',
                padding: '0'
              }
            },
            labels: 'floating'
          };

          if (isMobile) {
            appearance.variables.gridColumnSpacing = '10px';
            appearance.variables.gridRowSpacing = '10px';
            appearance.rules['.Input'].fontSize = '16px';
            appearance.rules['.Input'].lineHeight = '1.3em';
            appearance.rules['.Label--resting'].fontSize = '0.975em';
            appearance.rules['.Label--floating'].fontSize = '0.775em';
            appearance.rules['.Label--floating'].top = '0.05em';
            appearance.rules['.Error'].fontSize = '0.8em';
          }

          // Initialize elements without amount (will be set when creating PaymentIntent)
          const elementsInstance = stripeInstance.elements({
            mode: 'payment',
            amount: 50000, // Placeholder amount
            currency: 'gbp',
            captureMethod: 'manual',
            appearance: appearance,
            fonts: [
              {
                cssSrc: 'https://rsms.me/inter/inter.css'
              }
            ]
          });

          const paymentElement = elementsInstance.create('payment', {
            fields: {
              billingDetails: {
                email: 'auto',
                name: 'auto',
                address: {
                  country: 'auto',
                  postalCode: 'auto'
                }
              }
            }
          });

          paymentElement.mount('.stripe');

          setStripe(stripeInstance);
          setElements(elementsInstance);
          setPaymentEl(paymentElement);

          // Set up button click handler
          const placeButton = document.querySelector('[data-button="1A"] a.action');
          if (placeButton) {
            placeButtonRef.current = placeButton;
            placeButton.addEventListener('click', handlePlaceBooking);
          }
        } catch (err) {
          console.error('Error initializing Stripe:', err);
        }
      };

      initializeStripe();
    }

    return () => {
      // Cleanup
      if (placeButtonRef.current) {
        placeButtonRef.current.removeEventListener('click', handlePlaceBooking);
      }
    };
  }, [stripeLoaded]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceBooking = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !paymentEl) {
      alert('Payment not ready. Please wait a moment and try again.');
      return;
    }

    // Submit payment form first
    const { error: submitError } = await elements.submit();
    if (submitError) {
      alert(submitError.message);
      return;
    }

    // Validate form
    if (!formData.firstName || !formData.surname || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    try {
      // Create PaymentIntent via API (matching PHP setup.php)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/stripe/setup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: 'create_payment_intent',
          first_name: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phoneNumber,
          user_ref: typeof window !== 'undefined' ? localStorage.getItem('token') ? 'user' : 'guest' : 'guest',
          customer_id: typeof window !== 'undefined' ? sessionStorage.getItem('stripe_customer_id') || '' : ''
        })
      });

      if (!res.ok) {
        alert('Setup error. Please try again.');
        return;
      }

      let payload = null;
      try {
        payload = await res.json();
      } catch (e2) {
        alert('Invalid setup response.');
        return;
      }

      const clientSecret = payload?.clientSecret;
      const paymentIntentId = payload?.paymentIntentId;
      const customerId = payload?.customerId;

      if (paymentIntentId && typeof window !== 'undefined') {
        sessionStorage.setItem('stripe_payment_intent_id', paymentIntentId);
      }
      if (customerId && typeof window !== 'undefined') {
        sessionStorage.setItem('stripe_customer_id', customerId);
      }

      if (!clientSecret) {
        alert('Missing client secret.');
        return;
      }

      // Confirm payment and redirect
      const { error } = await stripe.confirmPayment({
        elements: elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`
        }
      });

      if (error) {
        alert(error.message);
        return;
      }
    } catch (error) {
      console.error('Error placing booking:', error);
      alert('Error placing booking. Please try again.');
    }
  };

  // Group items by date
  const groupedByDate = bagItems.reduce((acc, item) => {
    const dateKey = item.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort();

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
                <div className="block" data-block="1" style={{ display: 'none' }}>
                  <div className="title">
                    <h1 className="one">Checkout</h1>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <form className="form" onSubmit={handlePlaceBooking}>
                    <div className="fields">
                      <div className="fieldset">
                        <div className="blocks" data-blocks="2">
                          <div className="block" data-block="2A">
                            <div className="blocks" data-blocks="3">
                              <div className="block" data-block="2AA">
                                <div className="title">
                                  <h2 className="two">Account</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="block" data-block="2B">
                            <div className="blocks" data-blocks="4">
                              <div className="block" data-block="2BA" data-inputs="2">
                                <div className="input">
                                  <label>First Name</label>
                                  <input 
                                    type="text" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="input">
                                  <label>Surname</label>
                                  <input 
                                    type="text" 
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="block" data-block="2BB" data-inputs="1">
                                <div className="input">
                                  <label>Email Address</label>
                                  <input 
                                    type="text" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoCapitalize="none"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="block" data-block="2BC" data-inputs="1">
                                <div className="input">
                                  <label>Phone Number</label>
                                  <input 
                                    type="text" 
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="block" data-block="2BD" data-inputs="1">
                                <div className="blocks" data-blocks="5">
                                  <div className="block" data-block="2BDA">
                                    <div className="input">
                                      <label>Password</label>
                                      <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                  </div>
                                  <div className="block" data-block="2BDB">
                                    <div className="toggle">
                                      <div className="icons">
                                        <div className="icon" data-icon="1">
                                          <i className="icons8 icons8-eye"></i>
                                        </div>
                                        <div className="icon" data-icon="2">
                                          <i className="icons8 icons8-eye-2"></i>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="fieldset">
                        <div className="blocks" data-blocks="6">
                          <div className="block" data-block="2A">
                            <div className="blocks" data-blocks="7">
                              <div className="block" data-block="2AA">
                                <div className="title">
                                  <h2 className="two">Payment</h2>
                                </div>
                              </div>
                              <div className="block" data-block="2AB">
                                <div className="logo">
                                  <div className="image">
                                    <a href="https://www.stripe.com" target="_blank" rel="noopener noreferrer">
                                      <img src="/assets/images/global/partners/stripe-1.png" width="100%" alt="Stripe" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="block" data-block="2B">
                            <div className="blocks" data-blocks="8">
                              <div className="block" data-block="2BA" data-inputs="1">
                                <div className="input">
                                  <div className="stripe" ref={stripeContainerRef}></div>
                                </div>
                              </div>
                              <div className="block" data-block="2BB">
                                <div className="checkbox">
                                  <div className="blocks" data-blocks="9">
                                    <div className="block" data-block="2BBA">
                                      <div 
                                        className={`icons ${formData.agreeToTerms ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <div className="icon" data-icon="1">
                                          <i className="icons8 icons8-checkbox"></i>
                                        </div>
                                        <div className="icon" data-icon="2">
                                          <i className="icons8 icons8-checked-checkbox"></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="block" data-block="2BBB">
                                      <div className="text">
                                        I agree to Journi&apos;s <a className="link" href="#" target="_blank">Terms & Conditions</a> and <a className="link" href="#" target="_blank">Privacy Policy</a>.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="block" data-block="2BC">
                                <div className="buttons">
                                  <div className="button medium" data-button="1A">
                                    <a 
                                      className="action" 
                                      href="#" 
                                      onClick={handlePlaceBooking}
                                    >
                                      <div className="text">Place Bookings</div>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="section two">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="dates">
                    <div className="blocks" data-blocks="2">
                      {sortedDates.map((dateKey) => (
                        <div key={dateKey} className="block" data-block="1A">
                          <div className="date">
                            <div className="blocks" data-blocks="3">
                              <div className="block" data-block="1AA">
                                <div className="subtitle">
                                  <div className="text">{formatDate(dateKey)}</div>
                                </div>
                              </div>
                              <div className="block" data-block="1AB">
                                <div className="experiences">
                                  <div className="blocks" data-blocks="4">
                                    {groupedByDate[dateKey].map((item) => (
                                      <div key={item.id} className="block" data-block="1ABA">
                                        <div className="experience">
                                          <div className="blocks" data-blocks="5">
                                            <div className="block" data-block="1ABAA">
                                              <a className="action" href={`/ibiza/sightseeing/experience?slug=${item.slug || item.experienceId || item.id || 'experience'}`}>
                                                <div className="images">
                                                  <div 
                                                    className="image" 
                                                    style={{
                                                      backgroundImage: `url('${item.image || '/assets/images/experiences/experience-1a.jpg'}')`
                                                    }}
                                                  ></div>
                                                </div>
                                              </a>
                                            </div>
                                            <div className="block" data-block="1ABAB">
                                              <div className="blocks" data-blocks="6">
                                                <div className="block" data-block="1ABABA">
                                                  <a href={`/ibiza/sightseeing/experience?slug=${item.slug || item.experienceId || item.id || 'experience'}`}>
                                                    <div className="title">
                                                      <h3 className="four">{item.experienceTitle || 'Experience'}</h3>
                                                    </div>
                                                  </a>
                                                </div>
                                                <div className="block" data-block="1ABABB">
                                                  <div className="details">
                                                    <table border="0" cellSpacing="0" cellPadding="0">
                                                      <tbody>
                                                        {item.startTime && item.endTime && (
                                                          <tr>
                                                            <td>Time</td>
                                                            <td>{formatTime(item.startTime)} - {formatTime(item.endTime)}</td>
                                                          </tr>
                                                        )}
                                                        <tr>
                                                          <td>Guests</td>
                                                          <td>{item.guests || 1}</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="block" data-block="1ABAC">
                                              <div className="price">
                                                <div className="text">€{Math.round(item.totalPrice || item.price || 0)}</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="totals">
                    <table border="0" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr>
                          <td>Subtotal</td>
                          <td>€{subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td>€{subtotal.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="block" data-block="3">
                  <div className="buttons">
                    <div className="button small" data-button="2A">
                      <div className="action">
                        <div className="text">
                          <span className="one">Scroll</span>
                          <span className="two">View More</span>
                          <span className="three">View Less</span>
                        </div>
                      </div>
                    </div>
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
