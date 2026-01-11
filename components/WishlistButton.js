'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { wishlistAPI } from '../lib/api';
import { notify, NOTIFICATION_TYPES } from './Notification';

export default function WishlistButton({ experienceId, initialInWishlist = false, onRemove }) {
  const router = useRouter();
  // Always start with false on client-side, then fetch real state
  // This prevents stale initialInWishlist from server-side props
  const [inWishlist, setInWishlist] = useState(typeof window === 'undefined' ? initialInWishlist : false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Shared function to fetch fresh wishlist state
  const fetchWishlistState = async () => {
    if (!experienceId || typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem('token') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      
      if (!token) {
        setInWishlist(false);
        return;
      }

      const { wishlistAPI } = await import('../lib/api');
      const response = await wishlistAPI.getAll({ token });
      const wishlist = response?.wishlist || [];
      
      // Check if this experience is in the wishlist
      const isInWishlist = wishlist.some(item => {
        const itemExpId = item.experienceId || item.experience?.id || item.id;
        return itemExpId === experienceId || 
               String(itemExpId) === String(experienceId) ||
               Number(itemExpId) === Number(experienceId);
      });
      
      setInWishlist(isInWishlist);
    } catch (error) {
      // Silently handle 401 (unauthorized) errors - user is not logged in
      if (error.status === 401 || error.message?.includes('User not found') || error.message?.includes('not found')) {
        setInWishlist(false);
        return;
      }
      
      // Only log unexpected errors
      console.error('Error fetching wishlist state:', error);
      // Fall back to initialInWishlist if fetch fails
      setInWishlist(initialInWishlist);
    }
  };

  // Always fetch fresh wishlist state on mount - ignore initialInWishlist prop
  // This ensures we get the latest state from the API, not cached/stale props
  useEffect(() => {
    if (experienceId && typeof window !== 'undefined') {
      // Fetch immediately on mount
      fetchWishlistState();
    }
  }, [experienceId]);

  // Don't sync with initialInWishlist prop - always fetch fresh from API
  // This prevents stale data from server-side props

  // Listen for wishlist changes from other components and route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWishlistChange = (event) => {
      if (event.detail?.experienceId === experienceId) {
        setInWishlist(event.detail.inWishlist);
      }
    };

    const handleRefreshWishlist = () => {
      // Refresh wishlist state when page becomes visible or refresh event is triggered
      fetchWishlistState();
    };

    const handleRouteChange = () => {
      // Refresh wishlist state when route changes (user navigates)
      fetchWishlistState();
    };

    window.addEventListener('wishlistChanged', handleWishlistChange);
    window.addEventListener('refreshWishlist', handleRefreshWishlist);
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Also refresh when page becomes visible (user navigates back)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleRefreshWishlist();
      }
    });
    
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange);
      window.removeEventListener('refreshWishlist', handleRefreshWishlist);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [experienceId, router]);

  // Debug: Log experienceId on mount
  useEffect(() => {
    if (!experienceId) {
      console.warn('WishlistButton: experienceId is missing', { experienceId });
    }
  }, [experienceId]);

  useEffect(() => {
    // Check if user is authenticated (has token in localStorage or cookies)
    if (typeof window !== 'undefined') {
      // Check localStorage first
      let token = localStorage.getItem('token');
      
      // If not in localStorage, check cookies
      if (!token) {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
      
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate experienceId
    if (!experienceId) {
      console.error('Experience ID is missing');
      notify('Error: Experience ID is missing. Please refresh the page and try again.', NOTIFICATION_TYPES.ERROR);
      return;
    }

    // Check authentication
    if (typeof window === 'undefined') return;
    
    // Check localStorage first
    let token = localStorage.getItem('token');
    
    // If not in localStorage, check cookies
    if (!token) {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    if (!token) {
      // Redirect to login or show message
      notify('Please log in to add items to your wishlist', NOTIFICATION_TYPES.WARNING);
      setTimeout(() => {
      window.location.href = '/account/log-in';
      }, 2000);
      return;
    }

    setIsLoading(true);

    try {
      // Validate experienceId - can be a number or UUID string
      // Check if it's a valid number
      const expIdNum = typeof experienceId === 'string' ? parseInt(experienceId, 10) : experienceId;
      const isNumeric = !isNaN(expIdNum) && expIdNum > 0;
      
      // Check if it's a valid UUID format (basic check: has dashes and is 36 chars)
      const isUUID = typeof experienceId === 'string' && 
                    experienceId.length === 36 && 
                    experienceId.includes('-');
      
      console.log('WishlistButton: Adding to wishlist', { experienceId, expIdNum, isNumeric, isUUID, type: typeof experienceId });
      
      if (!isNumeric && !isUUID) {
        console.error('Invalid experience ID:', { experienceId, expIdNum, isNumeric, isUUID });
        throw new Error('Invalid experience ID format');
      }

      // Use the ID as-is (number or UUID string)
      const validExpId = isNumeric ? expIdNum : experienceId;

      if (inWishlist) {
        // Remove from wishlist (toggle off)
        console.log('Removing from wishlist:', validExpId);
        await wishlistAPI.remove(validExpId);
        setInWishlist(false);
        notify('Removed from wishlist', NOTIFICATION_TYPES.SUCCESS);
        
        // Dispatch event to sync other WishlistButton components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wishlistChanged', {
            detail: { experienceId: validExpId, inWishlist: false }
          }));
        }
        
        // Call onRemove callback if provided (for wishlist page to remove from list)
        if (onRemove) {
          onRemove();
        }
      } else {
        // Add to wishlist (toggle on)
        console.log('Adding to wishlist:', validExpId);
        await wishlistAPI.add(validExpId);
        setInWishlist(true);
        notify('Added to wishlist', NOTIFICATION_TYPES.SUCCESS);
        
        // Dispatch event to sync other WishlistButton components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wishlistChanged', {
            detail: { experienceId: validExpId, inWishlist: true }
          }));
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      notify(error.message || 'Failed to update wishlist. Please try again.', NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    // Show empty heart for non-authenticated users (can still click to prompt login)
    return (
      <div className="icons">
        <div className="icon one" onClick={handleWishlistToggle} style={{ cursor: 'pointer' }}>
          <i className="icons8 icons8-heart"></i>
        </div>
        <div className="icon two">
          <i className="icons8 icons8-heart-2"></i>
        </div>
      </div>
    );
  }

  return (
    <div className={`icons ${inWishlist ? 'active' : ''}`}>
      <div 
        className="icon one"
        onClick={handleWishlistToggle}
        style={{ cursor: isLoading ? 'wait' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
      >
        <i className="icons8 icons8-heart"></i>
      </div>
      <div 
        className="icon two"
        onClick={handleWishlistToggle}
        style={{ cursor: isLoading ? 'wait' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
      >
        <i className="icons8 icons8-heart-2"></i>
      </div>
    </div>
  );
}

