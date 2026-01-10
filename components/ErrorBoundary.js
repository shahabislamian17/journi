'use client';

import React from 'react';
import { notify, NOTIFICATION_TYPES } from './Notification';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console but don't show Next.js overlay
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Show user-friendly notification instead
    if (error?.message) {
      notify(error.message, NOTIFICATION_TYPES.ERROR);
    } else {
      notify('An error occurred. Please try again.', NOTIFICATION_TYPES.ERROR);
    }
    
    // Reset error state after a moment
    setTimeout(() => {
      this.setState({ hasError: false, error: null });
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      // Render children normally - error is handled via notification
      return this.props.children;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

