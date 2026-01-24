'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../../../../../../../lib/api';

export default function Form() {
  const router = useRouter();
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    accountType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    // alert('Register handleSubmit called - isLoading: ' + isLoading);
    // CRITICAL: Prevent default form submission - MUST be first thing
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent multiple simultaneous submissions
    if (isLoading) {
      // alert('Register already processing, ignoring submit');
      return;
    }
    
    // ALWAYS read values directly from DOM inputs to get the latest values (including autofill)
    const form = e?.target?.closest?.('form') || document.querySelector('form[data-form="register"]');
    let email = '';
    let password = '';
    let firstName = '';
    let lastName = '';
    let accountType = '';
    
    if (form) {
      const emailInput = form.querySelector('input[name="email"]');
      const passwordInput = form.querySelector('input[name="password"]');
      const firstNameInput = form.querySelector('input[name="firstName"]');
      const lastNameInput = form.querySelector('input[name="lastName"]');
      const accountTypeSelect = form.querySelector('select[name="accountType"]');
      
      email = emailInput?.value?.trim() || '';
      password = passwordInput?.value?.trim() || '';
      firstName = firstNameInput?.value?.trim() || '';
      lastName = lastNameInput?.value?.trim() || '';
      accountType = accountTypeSelect?.value?.trim() || '';
    } else {
      // Fallback to formData if form not found
      email = formData.email?.trim() || '';
      password = formData.password?.trim() || '';
      firstName = formData.firstName?.trim() || '';
      lastName = formData.lastName?.trim() || '';
      accountType = formData.accountType?.trim() || '';
    }
    
    // alert('Register validation - email: "' + email + '", firstName: "' + firstName + '", lastName: "' + lastName + '", accountType: "' + accountType + '", password: ' + (password ? '***' : 'empty'));
    
    if (!email || !password || !firstName || !lastName || !accountType) {
      // alert('Register validation failed - missing fields');
      setError('Please fill in all required fields.');
      setIsLoading(false); // Ensure loading is false on validation error
      return;
    }
    
    // Update formData with the values we're using (from DOM)
    setFormData(prev => ({ ...prev, email, password, firstName, lastName, accountType }));

    setError('');
    setIsLoading(true);
    console.log('[Register] isLoading set to true');

    console.log('[Register] Form submitted', { email, hasPassword: !!password, accountType });

    try {
      // Convert accountType (Traveller/Host) to role (TRAVELLER/HOST) for API
      const role = accountType && accountType.toUpperCase() === 'HOST' 
        ? 'HOST' 
        : 'TRAVELLER'; // Default to TRAVELLER
      
      console.log('[Register] Calling API...');
      const response = await authAPI.register({
        firstName,
        lastName,
        email,
        password,
        role: role, // Send as role
        accountType, // Keep for backward compatibility if needed
      });

      // Store token in localStorage and cookies
      console.log('[Register] API response received', { hasToken: !!response.token });
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Also set cookie for server-side access
        document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
        
        // Wait a moment for cookie to be set before redirecting
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('[Register] Token stored, redirecting...');
        // Redirect to bookings page - use window.location for full reload (prevents React DOM errors)
        window.location.href = '/account/bookings';
      }
    } catch (error) {
      console.error('[Register] Error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Attach backup click handler directly to button element (after handleSubmit is defined)
  useEffect(() => {
    const button = submitButtonRef.current;
    if (!button) return;

    const handleClick = (e) => {
      // alert('Register button clicked (useEffect backup handler)');
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

  // SECURITY: Never read email/password from URL - only use POST body
  // Only pre-fill non-sensitive fields if needed
  useEffect(() => {
    if (typeof window !== 'undefined' && router.isReady) {
      const { firstName, lastName, accountType } = router.query;
      
      // Remove email and password from URL if present
      if (router.query.email || router.query.password) {
        const newQuery = { ...router.query };
        delete newQuery.email;
        delete newQuery.password;
        router.replace({
          pathname: router.pathname,
          query: newQuery
        }, undefined, { shallow: true });
      }
      
      // Only pre-fill non-sensitive fields (firstName, lastName, accountType)
      if (firstName || lastName || accountType) {
        setFormData(prev => ({
          ...prev,
          ...(firstName && typeof firstName === 'string' ? { firstName: decodeURIComponent(firstName) } : {}),
          ...(lastName && typeof lastName === 'string' ? { lastName: decodeURIComponent(lastName) } : {}),
          ...(accountType && typeof accountType === 'string' ? { accountType: decodeURIComponent(accountType) } : {}),
        }));
      }
    }
  }, [router.isReady, router.query]);

  // Update select label position when value changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectElement = document.querySelector('select[name="accountType"]');
      if (selectElement) {
        const container = selectElement.closest('.select');
        if (container && formData.accountType && formData.accountType.trim() !== '') {
          container.setAttribute('data-input', 'focus');
          // Don't add inline styles - CSS handles padding automatically
        } else if (container && (!formData.accountType || formData.accountType.trim() === '')) {
          container.removeAttribute('data-input');
          // Don't manipulate inline styles - CSS handles everything
        }
      }
    }
  }, [formData.accountType]);

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
                      <h1 className="three">Register</h1>
                    </div>
                  </div>
                  <div className="block" data-block="1B">
                    <div className="text">
                      <p className="small three">Create your account.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small five">
                    <span>Got an account?</span>
                    <span>Click <Link className="link" href="/account/log-in">here</Link>.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form 
                  ref={formRef}
                  className="form" 
                  data-form="register" 
            
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
                        <div className="block" data-block="1A" data-inputs="2">
                          <div className="input">
                            <label>
                              <span>First Name</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="input">
                            <label>
                              <span>Surname</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="block" data-block="1B" data-inputs="1">
                          <div className="input">
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

                        <div className="block" data-block="1C" data-inputs="1" data-password="1">
                          <div className="blocks" data-blocks="3">
                            <div className="block" data-block="1CA">
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
                            <div className="block" data-block="1CB">
                              <div className="toggle" onClick={togglePasswordVisibility}>
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

                        <div className="block" data-block="1D" data-inputs="1">
                          <div className="select" data-input="">
                            <label>
                              <span>Account Type</span>
                            </label>
                            <select
                              type="text"
                              name="accountType"
                              value={formData.accountType}
                              onChange={handleChange}
                              required
                            >
                              <option></option>
                              <option value="Traveller">Traveller</option>
                              <option value="Host">Host</option>
                            </select>
                          </div>
                        </div>

                        <div className="block" data-block="1E">
                          <div className="buttons">
                          <div className="button medium" data-button="1A">
                              <button
                                ref={submitButtonRef}
                                type="button"
                                className="action"
                                disabled={isLoading}
                                onClick={(e) => {
                                  // alert('Register button onClick handler');
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                style={{
                                  border: 'none',
                                  cursor: isLoading ? 'wait' : 'pointer',
                                  width: '100%'
                                }}
                              >
                                 <div className="text">
                                   {isLoading ? 'Registering...' : 'Register'}
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
