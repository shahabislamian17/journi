'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { wishlistAPI } from '../lib/api';

export default function WishlistButton({ experienceId, initialInWishlist = false, onRemove }) {
  const router = useRouter();
  // Always start with false on client-side, then fetch real state
  // This prevents stale initialInWishlist from server-side props
  // Only use initialInWishlist on server-side render, client-side always starts false
  const [inWishlist, setInWishlist] = useState(false);
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
      // Normalize both IDs to strings for comparison to avoid type mismatches
      const normalizedExpId = String(experienceId).trim();
      const isInWishlist = wishlist.some(item => {
        // Get the experience ID from the wishlist item
        const itemExpId = item.experienceId || item.experience?.id || item.id;
        if (!itemExpId) return false;
        
        // Normalize to string and compare
        const normalizedItemId = String(itemExpId).trim();
        const matches = normalizedItemId === normalizedExpId;
        
        // Debug logging in development
        if (process.env.NODE_ENV === 'development' && matches) {
          console.log('WishlistButton: Found match', {
            experienceId: normalizedExpId,
            itemExpId: normalizedItemId,
            item: item
          });
        }
        
        return matches;
      });
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('WishlistButton: Wishlist state check', {
          experienceId: normalizedExpId,
          wishlistLength: wishlist.length,
          isInWishlist,
          wishlistItemIds: wishlist.map(item => item.experienceId || item.experience?.id || item.id)
        });
      }
      
      setInWishlist(isInWishlist);
    } catch (error) {
      // Handle 401 (unauthorized) errors - user is not logged in or token is invalid
      if (error.status === 401 || error.status === 404 || error.message?.includes('User not found') || error.message?.includes('not found') || error.message?.includes('unauthorized')) {
        // User is not authenticated or doesn't exist - definitely not in wishlist
        setInWishlist(false);
        setIsAuthenticated(false); // Also update authentication state
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Clear token cookie
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
        return;
      }
      
      // Only log unexpected errors
      console.error('Error fetching wishlist state:', error);
      // On error, default to false (not in wishlist) to prevent false positives
      setInWishlist(false);
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
      
      // Only set authenticated if token exists and is not empty
      const hasValidToken = !!token && token.trim() !== '';
      setIsAuthenticated(hasValidToken);
      
      // If no valid token, ensure wishlist state is false
      if (!hasValidToken) {
        setInWishlist(false);
      }
    }
  }, []);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate experienceId
    if (!experienceId) {
      console.error('Experience ID is missing');
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
      // Redirect to login
      setTimeout(() => {
      window.location.href = '/account/log-in';
      }, 2000);
      return;
    }

    setIsLoading(true);

    try {
      // Always convert to string - database expects String/UUID
      const validExpId = String(experienceId).trim();
      
      if (!validExpId || validExpId === '') {
        console.error('Invalid experience ID:', { experienceId, validExpId });
        throw new Error('Invalid experience ID format');
      }
      
      console.log('WishlistButton: Toggling wishlist', { experienceId, validExpId, type: typeof experienceId, inWishlist });

      if (inWishlist) {
        // Remove from wishlist (toggle off)
        console.log('Removing from wishlist:', validExpId);
        await wishlistAPI.remove(validExpId, { token });
        setInWishlist(false);
        
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
        await wishlistAPI.add(validExpId, { token });
        setInWishlist(true);
        
        // Dispatch event to sync other WishlistButton components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wishlistChanged', {
            detail: { experienceId: validExpId, inWishlist: true }
          }));
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure inWishlist is false when user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && inWishlist) {
      setInWishlist(false);
    }
  }, [isAuthenticated, inWishlist]);

  // Always show empty heart if not authenticated, regardless of inWishlist state
  if (!isAuthenticated) {
    // Show empty heart for non-authenticated users (can still click to prompt login)
    return (
      <div className="icons">
        <div className="icon one" data-icon="1" onClick={handleWishlistToggle} style={{ cursor: 'pointer' }}>
          <i className="icons8 icons8-heart"></i>
        </div>
        <div className="icon two" data-icon="2">
          <i className="icons8 icons8-heart-2"></i>
        </div>
      </div>
    );
  }

  return (
    <div className={`icons ${inWishlist ? 'active' : ''} ${isLoading ? 'loading' : ''}`}>
      <div 
        className="icon one"
        data-icon="1"
        onClick={handleWishlistToggle}
        style={{ cursor: isLoading ? 'wait' : 'pointer' }}
      >
        <i className="icons8 icons8-heart"></i>
      </div>
      <div 
        className="icon two"
        data-icon="2"
        onClick={handleWishlistToggle}
        style={{ cursor: isLoading ? 'wait' : 'pointer' }}
      >
        <i className="icons8 icons8-heart-2"></i>
      </div>
    </div>
  );
}

