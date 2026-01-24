'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../../../../../../lib/api';

export default function Form() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'error' | 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus({ type: '', message: '' });

    const trimmed = newPassword.trim();
    if (!trimmed) {
      setStatus({ type: 'error', message: 'Please enter a new password.' });
      return;
    }

    const token = typeof window !== 'undefined' ? (router.query?.token || '') : '';
    if (!token) {
      setStatus({ type: 'error', message: 'Reset token is missing from the URL.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await authAPI.resetPassword({ token, newPassword: trimmed });
      setStatus({ type: 'success', message: res?.message || 'Password reset successfully' });
      setNewPassword('');
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Failed to reset password. Please try again.' });
    } finally {
      setSubmitting(false);
    }
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
    
                                            <h1 className="three">Reset Password</h1>
    
                                        </div>
    
                                    </div>
    
                                    <div className="block" data-block="1B">
    
                                        <div className="text">
    
                                            <p className="small three">Reset your password.</p>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2" style="display: none">
    
                                <div className="text">
    
                                    <p className="small four">
    
                                        <span>Remembered your password?</span>
                                        <span>Click <a className="link" href="/account/log-in">here</a>.</span>
    
                                    </p>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="section two">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <form className="form" data-form="reset-password" onSubmit={handleSubmit} noValidate>
                                    {status.message && (
                                      <div style={{
                                        color: status.type === 'success' ? '#1b5e20' : 'red',
                                        marginBottom: '1rem',
                                        padding: '0.75rem',
                                        backgroundColor: status.type === 'success' ? '#e8f5e9' : '#ffebee',
                                        borderRadius: '4px',
                                        border: `1px solid ${status.type === 'success' ? '#2e7d32' : '#f44336'}`
                                      }}>
                                        {status.message}
                                      </div>
                                    )}
    
                                    <div className="fields">
    
                                        <div className="fieldset">
    
                                            <div className="blocks" data-blocks="2">
    
                                                <div className="block" data-block="1B" data-inputs="1">
    
                                                    <div className="blocks" data-blocks="3">
    
                                                        <div className="block" data-block="1BA">
    
                                                            <div className="input">
    
                                                                <label><span>New Password</span></label>
    
                                                                <input
                                                                  type={showPassword ? 'text' : 'password'}
                                                                  name="new-password"
                                                                  value={newPassword}
                                                                  onChange={(e) => setNewPassword(e.target.value)}
                                                                  required
                                                                />
    
                                                            </div>
    
                                                        </div>
    
                                                        <div className="block" data-block="1BB">
    
                                                            <div
                                                              className="toggle"
                                                              onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setShowPassword((v) => !v);
                                                              }}
                                                              style={{ cursor: 'pointer' }}
                                                            >
    
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
    
                                                <div className="block" data-block="1C">
    
                                                    <div className="buttons">
    
                                                        <div className="button medium" data-button="1A">
    
                                                            <button
                                                              type="submit"
                                                              className="action"
                                                              disabled={submitting}
                                                              style={{ border: 'none', width: '100%', cursor: submitting ? 'wait' : 'pointer' }}
                                                            >
                                                                <div className="text">{submitting ? 'Resetting...' : 'Reset Password'}</div>
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
