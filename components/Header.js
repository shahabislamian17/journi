'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Bag API - inline version to avoid import issues
const getBagCount = () => {
  if (typeof window === 'undefined') return 0;
  try {
    const bagData = localStorage.getItem('journi_bag');
    return bagData ? JSON.parse(bagData).length : 0;
  } catch (error) {
    console.error('Error reading bag:', error);
    return 0;
  }
};

export default function Header() {
  const router = useRouter();

  useEffect(() => {
    // Ensure logo link works correctly
    const logoLink = document.querySelector('header .logo a');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Always force a full page reload to get fresh server-side data
        // This ensures wishlist state is refreshed from the database
        window.location.href = '/';
      });
    }

    // Update bag icon badge
    const updateBagIcon = () => {
      const count = getBagCount();
      const bagIconAction = document.querySelector('header .icon.two .action');
      const bagIconNumber = bagIconAction?.querySelector('.number');
      
      if (bagIconAction) {
        // Make bag icon clickable to open bag with smooth animation
        bagIconAction.style.cursor = 'pointer';
        bagIconAction.onclick = (e) => {
          e.preventDefault();
          const bagElement = document.querySelector('section.bag');
          if (bagElement) {
            // First, make it visible with delay class (off-screen)
            bagElement.classList.add('delay');
            // Add body class for overlay management
            if (document.body) {
              document.body.classList.add('bag-active');
              document.body.style.overflow = 'hidden';
            }
            // Use requestAnimationFrame to ensure smooth transition
            requestAnimationFrame(() => {
              // Now add active class to trigger slide-in animation
              bagElement.classList.add('active');
            });
          }
        };

        if (count > 0) {
          if (!bagIconNumber) {
            // Create number badge if it doesn't exist
            const numberDiv = document.createElement('div');
            numberDiv.className = 'number';
            numberDiv.textContent = count;
            bagIconAction.insertBefore(numberDiv, bagIconAction.firstChild);
          } else {
            // Update existing badge
            bagIconNumber.textContent = count;
            bagIconNumber.style.display = 'block';
          }
        } else {
          // Hide badge if no items
          if (bagIconNumber) {
            bagIconNumber.style.display = 'none';
          }
        }
      }
    };

    // Setup menu icon styling (scripts.js handles the click event with delegated handler)
    const setupMenuIcon = () => {
      // Try multiple selectors to find the menu icon
      const menuIcon = document.querySelector('header .content .sections .section.three .blocks .block .icons .icon[data-icon="1"]') ||
                       document.querySelector('header .content .sections .section.three .blocks .block .icons .icon.one');
      
      if (menuIcon) {
        menuIcon.style.cursor = 'pointer';
        // scripts.js handles the click event via delegated handler, so we just style it
      }
    };

    // Initial update with a slight delay to ensure DOM is ready
    setTimeout(() => {
      updateBagIcon();
      setupMenuIcon();
    }, 100);

    // Listen for bag updates
    const handleBagUpdate = () => {
      updateBagIcon();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('bagUpdated', handleBagUpdate);
      
      // Re-setup menu icon on route changes
      const handleRouteChange = () => {
        setTimeout(() => {
          setupMenuIcon();
        }, 100);
      };
      
      if (router.events) {
        router.events.on('routeChangeComplete', handleRouteChange);
      }
      
      return () => {
        window.removeEventListener('bagUpdated', handleBagUpdate);
        if (router.events) {
          router.events.off('routeChangeComplete', handleRouteChange);
        }
      };
    }
  }, [router]);

  return null; // This component only adds event listeners and updates DOM
}

