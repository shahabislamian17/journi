'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { bagAPI } from '../../../../../lib/bag';
import { authAPI } from '../../../../../lib/api';

export default function Checkout() {
  const router = useRouter();
  const [bagItems, setBagItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const paymentSectionRef = useRef(null);

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

  // Check if user is logged in and load user data
  useEffect(() => {
    const checkAuthAndLoadUser = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      
      if (token) {
        setIsLoggedIn(true);
        try {
          // Fetch user data from API
          const user = await authAPI.getMe({ token });
          if (user && user.user) {
            setFormData(prev => ({
              ...prev,
              firstName: user.user.firstName || '',
              surname: user.user.lastName || '',
              email: user.user.email || '',
              phoneNumber: user.user.phone || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If API fails, try localStorage as fallback
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
      } else {
        setIsLoggedIn(false);
      }
    };
    
    checkAuthAndLoadUser();
  }, []);

  // Initialize Stripe when script loads - matching PHP flow exactly
  useEffect(() => {
    if (stripeLoaded && typeof window !== 'undefined' && window.Stripe) {
      const initializeStripe = async () => {
        try {
          const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';
          
          console.log('Initializing Stripe with key:', stripePublishableKey.substring(0, 20) + '...');
          
          // Validate that it's a publishable key (starts with pk_), not a secret key
          if (!stripePublishableKey.startsWith('pk_')) {
            console.error('Invalid Stripe key: Must be a publishable key (pk_test_... or pk_live_...), not a secret key (sk_test_... or sk_live_...)');
            console.error('Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file with a publishable key from Stripe Dashboard.');
            console.error('For local development, create a .env.local file with: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here');
            return;
          }
          
          if (!stripeContainerRef.current) {
            console.error('Stripe container not found');
            return;
          }
          
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
          
          console.log('Stripe payment element mounted successfully');

          setStripe(stripeInstance);
          setElements(elementsInstance);
          setPaymentEl(paymentElement);

          // Set up button click handler
          const placeButton = document.querySelector('[data-button="1A"] a.action');
          if (placeButton) {
            placeButtonRef.current = placeButton;
            placeButton.addEventListener('click', handlePlaceBooking);
          } else {
            console.warn('Place booking button not found');
          }
        } catch (err) {
          console.error('Error initializing Stripe:', err);
        }
      };

      // Wait a bit for the container to be ready, then initialize
      if (stripeContainerRef.current) {
        initializeStripe();
      } else {
        // Wait for container to be ready
        const checkContainer = setInterval(() => {
          if (stripeContainerRef.current) {
            clearInterval(checkContainer);
      initializeStripe();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkContainer);
          if (!stripeContainerRef.current) {
            console.error('Stripe container not found after 5 seconds');
          }
        }, 5000);
        
        return () => {
          clearInterval(checkContainer);
        };
      }
    } else if (stripeLoaded && typeof window !== 'undefined' && !window.Stripe) {
      console.error('Stripe script loaded but window.Stripe is not available');
    } else if (!stripeLoaded) {
      console.log('Waiting for Stripe script to load...');
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

  const handleScrollToPayment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else if (stripeContainerRef.current) {
      stripeContainerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  const handlePlaceBooking = async (e) => {
    e.preventDefault();
    
    // Wait for Stripe to be ready with a timeout
    if (!stripe || !elements || !paymentEl) {
      // Wait up to 2 seconds for Stripe to initialize
      let attempts = 0;
      while ((!stripe || !elements || !paymentEl) && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!stripe || !elements || !paymentEl) {
        alert('Payment system is initializing. Please wait a moment and try again.');
      return;
      }
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
    
    // Validate password only if user is not logged in
    if (!isLoggedIn && !formData.password) {
      alert('Please enter a password to create an account');
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    try {
      // Calculate total amount from bag items (in pence/cents)
      const totalAmount = Math.round(subtotal * 100); // Convert to pence/cents
      
      if (totalAmount <= 0) {
        alert('Invalid booking amount. Please check your bag items.');
        return;
      }

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
          customer_id: typeof window !== 'undefined' ? sessionStorage.getItem('stripe_customer_id') || '' : '',
          amount: totalAmount // Pass the calculated amount
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData?.error || `Setup error (${res.status}). Please try again.`;
        console.error('Stripe setup error:', errorMessage);
        alert(errorMessage);
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

      // Store bag items and form data in sessionStorage before redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkout_bag_items', JSON.stringify(bagItems));
        sessionStorage.setItem('checkout_form_data', JSON.stringify({
          firstName: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          isLoggedIn: isLoggedIn
        }));
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
        onLoad={() => {
          console.log('Stripe script loaded');
          setStripeLoaded(true);
        }}
        onError={(e) => {
          console.error('Stripe script failed to load:', e);
        }}
        strategy="afterInteractive"
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
                                  <label><span>First Name</span></label>
                                  <input 
                                    type="text" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="input">
                                  <label><span>Surname</span></label>
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
                                  <label><span>Email Address</span></label>
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
                                  <label><span>Phone Number</span></label>
                                  <input 
                                    type="text" 
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              {!isLoggedIn && (
                              <div className="block" data-block="2BD" data-inputs="1">
                                <div className="blocks" data-blocks="5">
                                  <div className="block" data-block="2BDA">
                                    <div className="input">
                                      <label><span>Password</span></label>
                                      <input 
                                          type={showPassword ? "text" : "password"} 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                          required
                                      />
                                    </div>
                                  </div>
                                  <div className="block" data-block="2BDB">
                                      <div className="toggle" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                        <div className={`icons ${showPassword ? 'active' : ''}`}>
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
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="fieldset" ref={paymentSectionRef}>
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
                      <div className="action" onClick={handleScrollToPayment} style={{ cursor: 'pointer' }}>
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
