'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../../../../../../../lib/api';

export default function Form() {
  const router = useRouter();
  const submitButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // SECURITY: Never read email/password from URL - only use POST body
  // Remove credentials from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined' && router.isReady) {
      if (router.query.email || router.query.password) {
        const newQuery = { ...router.query };
        delete newQuery.email;
        delete newQuery.password;
        router.replace({
          pathname: router.pathname,
          query: newQuery
        }, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    // CRITICAL: Prevent default form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // ALWAYS read values directly from DOM inputs to get the latest values (including autofill)
    const form = e?.target?.closest?.('form') || document.querySelector('form[data-form="log-in"]');
    let email = '';
    let password = '';
    
    if (form) {
      const emailInput = form.querySelector('input[name="email"]');
      const passwordInput = form.querySelector('input[name="password"]');
      email = emailInput?.value?.trim() || '';
      password = passwordInput?.value?.trim() || '';
    } else {
      // Fallback to formData if form not found
      email = formData.email?.trim() || '';
      password = formData.password?.trim() || '';
    }
    
    // alert('Login handleSubmit called - email: "' + email + '", password: ' + (password ? '***' : 'empty'));
    
    if (!email || !password) {
      // alert('Login validation failed - email: "' + email + '", password: "' + (password ? '***' : 'empty') + '"');
      setError('Please fill in all required fields.');
      return;
    }
    
    // Update formData with the values we're using (from DOM)
    setFormData(prev => ({ ...prev, email, password }));
    
    // alert('Login validation passed, proceeding...');

    setError('');
    setIsLoading(true);

    console.log('[Login] Form submitted', { email, hasPassword: !!password });

    try {
      console.log('[Login] Calling API...');
      const response = await authAPI.login({
        email,
        password,
      });
      console.log('[Login] API response received', { hasToken: !!response.token });

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Always set cookie so server-side can access it
        const maxAge = formData.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days
        document.cookie = `token=${response.token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;

        // Wait a moment for cookie to be set before redirecting
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if there's a redirect destination stored (from auth-required links)
        const redirectAfterLogin = typeof window !== 'undefined' ? sessionStorage.getItem('redirectAfterLogin') : null;
        
        if (redirectAfterLogin) {
          // Clear the stored redirect
          sessionStorage.removeItem('redirectAfterLogin');
          // Use window.location for full page reload (prevents React DOM errors)
          window.location.href = redirectAfterLogin;
        } else {
          // Default redirect to bookings page - use window.location for full reload
          window.location.href = '/account/bookings';
        }
        return; // Prevent any further execution
      }
    } catch (error) {
      console.error('[Login] Error:', error);
      // Prevent error from bubbling up in development
      if (error && error.message) {
        const errorMessage = error.message.includes('Invalid credentials') 
          ? 'Invalid email or password. Please check your credentials and try again.'
          : error.message;
        setError(errorMessage);
      } else {
        setError('An error occurred during login. Please try again.');
      }
      // Don't re-throw the error - we've handled it
    } finally {
      setIsLoading(false);
    }
  };

  // Attach backup click handler directly to button element (after handleSubmit is defined)
  useEffect(() => {
    const button = submitButtonRef.current;
    if (!button) return;

    const handleClick = (e) => {
      // alert('Login button clicked (useEffect backup handler)');
      // Only handle if onClick didn't already handle it
      if (e.defaultPrevented) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      if (isLoading) {
        // alert('Button is disabled, returning');
        return;
      }
      
      // alert('About to call handleSubmit from useEffect');
      const syntheticEvent = { 
        preventDefault: () => {}, 
        stopPropagation: () => {},
        target: button
      };
      handleSubmit(syntheticEvent);
    };

    // Use capture phase to catch event early
    button.addEventListener('click', handleClick, true);
    
    return () => {
      button.removeEventListener('click', handleClick, true);
    };
  }, [isLoading, handleSubmit]); // Include handleSubmit in dependencies

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="blocks" data-blocks="2">
                  <div className="block" data-block="1A">
                    <div className="title">
                      <h1 className="three">Log In</h1>
                    </div>
                  </div>
                  <div className="block" data-block="1B">
                    <div className="text">
                      <p className="small three">Access your account.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small five">
                    <span>New to Journi?</span>
                    <span>Click <Link className="link" href="/account/register">here</Link>.</span>
                  </p>
                  <p className="small five">
                    <span>Forgot your password?</span>
                    <span>Click <Link className="link" href="/account/forgot-password">here</Link>.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form 
                  className="form" 
                  data-form="log-in" 
              
                  noValidate
                >
                  {error && (
                    <div style={{ 
                      color: 'red', 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      backgroundColor: '#ffebee',
                      borderRadius: '4px',
                      border: '1px solid #f44336'
                    }}>
                      {error}
                    </div>
                  )}
                  <div className="fields">
                    <div className="fieldset">
                      <div className="blocks" data-blocks="2">
                        {/* Email Address */}
                        <div className="block" data-block="1A" data-inputs="1">
                          <div className="input" data-input="">
                            <label>
                              <span>Email Address</span>
                            </label>
                            <input
                              type="text"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              autoCapitalize="none"
                              required
                            />
                          </div>
                        </div>

                        {/* Password with toggle */}
                        <div className="block" data-block="1B" data-inputs="1" data-password="1">
                          <div className="blocks" data-blocks="3">
                            <div className="block" data-block="1BA">
                              <div className="input">
                                <label>
                                  <span>Password</span>
                                </label>
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="block" data-block="1BB">
                              <div className="toggle" onClick={togglePasswordVisibility}>
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

                        {/* Remember Me checkbox */}
                        <div className="block" data-block="1C">
                          <div
                            className="checkbox"
                            onClick={() =>
                              setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="blocks" data-blocks="4">
                              <div className="block" data-block="1CA">
                                <div className="icons">
                                  <div
                                    className={`icon ${!formData.rememberMe ? 'active' : ''}`}
                                    data-icon="1"
                                  >
                                    <i className="icons8 icons8-checkbox"></i>
                                  </div>
                                  <div
                                    className={`icon ${formData.rememberMe ? 'active' : ''}`}
                                    data-icon="2"
                                  >
                                    <i className="icons8 icons8-checked-checkbox"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="block" data-block="1CB">
                                <div className="text">Remember Me</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit button */}
                        <div className="block" data-block="1D">
                          <div className="buttons">
                            <div className="button medium" data-button="1A">
                              <button
                                ref={submitButtonRef}
                                type="button"
                                className="action"
                                disabled={isLoading}
                                onClick={(e) => {
                                  // alert('Login button onClick handler');
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                style={{
                                  border: 'none',
                                  cursor: isLoading ? 'wait' : 'pointer',
                                  width: '100%',
                                  position: 'relative',
                                  zIndex: 9999,
                                  pointerEvents: 'auto'
                                }}
                              >
                                <div className="text">
                                  {isLoading ? 'Logging in...' : 'Log In'}
                                </div>
                                <div className="background"></div>
                              </button>
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
        </div>
      </div>
    </div>
  );
}
