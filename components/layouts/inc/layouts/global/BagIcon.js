'use client';

import { useEffect, useState } from 'react';
import { bagAPI } from '../../../../../lib/bag';

export default function BagIcon() {
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    // Load bag count on mount
    const loadBagCount = () => {
      const count = bagAPI.getCount();
      setBagCount(count);
    };

    // Initial load
    loadBagCount();

    // Listen for bag updates
    const handleBagUpdate = () => {
      loadBagCount();
    };

    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('bagUpdated', handleBagUpdate);
      
      return () => {
        window.removeEventListener('bagUpdated', handleBagUpdate);
      };
    }
  }, []);

  const handleBagClick = (e) => {
    e.preventDefault();
    const bagElement = document.querySelector('.bag');
    if (bagElement) {
      bagElement.classList.add('active');
    }
  };

  return (
    <div className="icon two">
      <div className="action" onClick={handleBagClick} style={{ cursor: 'pointer' }}>
        {bagCount > 0 && (
          <div className="number">{bagCount}</div>
        )}
        <div className="icon">
          <i className="icons8 icons8-bag"></i>
        </div>
      </div>
    </div>
  );
}

