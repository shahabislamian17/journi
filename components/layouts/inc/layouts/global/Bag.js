'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { bagAPI } from '../../../../../lib/bag';

export default function Bag() {
  const router = useRouter();
  const [bagItems, setBagItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.className = "overlay";
    }
  }, []);

  useEffect(() => {
    // Load bag items on mount and on updates
    const loadBagItems = () => {
      const items = bagAPI.getAll();
      setBagItems(items);
      setSubtotal(bagAPI.getSubtotal());
    };

    // Initial load
    loadBagItems();

    // Listen for bag updates
    const handleBagUpdate = () => {
      loadBagItems();
    };

    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('bagUpdated', handleBagUpdate);
      
      return () => {
        window.removeEventListener('bagUpdated', handleBagUpdate);
      };
    }
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid date
      }
      return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch (e) {
      return dateString; // Return original if error
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const handleRemove = (e, itemId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Removing item from bag:', itemId);
    
    try {
      const result = bagAPI.remove(itemId);
      console.log('Remove result:', result);
      
      if (result) {
        // Force update by reloading bag items
        const items = bagAPI.getAll();
        setBagItems(items);
        setSubtotal(bagAPI.getSubtotal());
      } else {
        console.error('Failed to remove item from bag');
      }
    } catch (error) {
      console.error('Error in handleRemove:', error);
    }
  };

  const handleCheckout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (bagItems.length === 0) {
      return;
    }
    router.push('/checkout');
  };

  const handleCloseBag = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const bagElement = document.querySelector('section.bag');
    if (bagElement) {
      // Remove active class first to trigger slide-out animation
      bagElement.classList.remove('active');
      
      // After animation completes, remove delay class and clean up
      setTimeout(() => {
        bagElement.classList.remove('delay');
        // Clear all inline styles that were set when opening
        bagElement.style.display = '';
        bagElement.style.visibility = '';
        bagElement.style.zIndex = '';
        bagElement.style.position = '';
        bagElement.style.pointerEvents = '';
      }, 600); // Match the CSS transition duration (0.6s)
    }
    
    // Remove body class and ensure pointer events are restored
    if (document.body) {
      document.body.classList.remove('bag-active');
      // Reset any inline styles that might block clicks
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
    }
    
    // Ensure overlay doesn't block clicks - explicitly set to none
    const overlay = document.querySelector('.bag .overlay');
    if (overlay) {
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
      overlay.style.zIndex = '-1';
    }
    
    // Use requestAnimationFrame to ensure DOM updates before allowing clicks
    requestAnimationFrame(() => {
      // Force a reflow to ensure styles are applied
      if (document.body) {
        document.body.offsetHeight; // Trigger reflow
      }
      // Double-check overlay is not blocking
      const overlayCheck = document.querySelector('.bag .overlay');
      if (overlayCheck && !bagElement?.classList.contains('active')) {
        overlayCheck.style.pointerEvents = 'none';
      }
    });
  };

  // Group items by date
  const groupedByDate = bagItems.reduce((acc, item) => {
    // Handle date string (ISO format) or Date object
    let dateKey;
    if (typeof item.date === 'string') {
      // Extract just the date part (YYYY-MM-DD) from ISO string
      dateKey = item.date.split('T')[0];
    } else if (item.date instanceof Date) {
      dateKey = item.date.toISOString().split('T')[0];
    } else {
      dateKey = item.date;
    }
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
        <div className="container">
            <div className="content">
                <div className="sections">
                    <div className="section one">
                        <div className="blocks" data-blocks="1">
                            <div className="block">
                                <div className="close">
                                    <div className="button circle" data-button="2A">
                    <div className="action" onClick={handleCloseBag}>
                                            <div className="icon">
                                                <i className="icons8 icons8-less-than"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block">
                                <div className="title">
                                    <h2 className="four">Bag</h2>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="section two">
                        <div className="blocks" data-blocks="1">
                            <div className="block">
                {bagItems.length === 0 ? (
                  <div className="empty">
                    <p className="small two">Your bag is empty</p>
                  </div>
                ) : (
                                <div className="dates">
                                    <div className="blocks" data-blocks="2">
                      {sortedDates.map((dateKey) => (
                        <div key={dateKey} className="block">
                          <div className="date">
                            <div className="blocks" data-blocks="3">
                              <div className="block">
                                <div className="subtitle">
                                  <div className="text">{formatDate(dateKey)}</div>
                                </div>
                              </div>
                                                    <div className="block">
                                                        <div className="experiences">
                                                            <div className="blocks" data-blocks="4">
                              {groupedByDate[dateKey].map((item) => (
                                <div key={item.id} className="block" data-item-id={item.id}>
                                  <div className="experience" data-item-id={item.id}>
                                    <div className="blocks" data-blocks="5">
                                      <div className="block">
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
                                      <div className="block">
                                        <div className="blocks" data-blocks="6">
                                          <div className="block">
                                            <a href={`/ibiza/sightseeing/experience?slug=${item.slug || item.experienceId || item.id || 'experience'}`}>
                                              <div className="title">
                                                <h3 className="four">{item.experienceTitle || 'Experience'}</h3>
                                              </div>
                                            </a>
                                          </div>
                                          <div className="block">
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
                                      <div className="block">
                                        <div className="blocks" data-blocks="7">
                                          <div className="block">
                                            <div className="price">
                                              <div className="text">€{(item.totalPrice || item.price || 0).toFixed(2)}</div>
                                            </div>
                                          </div>
                                          <div className="block">
                                            <div 
                                              className="remove" 
                                              role="button"
                                              tabIndex={0}
                                              onClick={(e) => handleRemove(e, item.id)} 
                                              onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                  e.preventDefault();
                                                  handleRemove(e, item.id);
                                                }
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              <div className="text">Remove</div>
                                            </div>
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
                    </div>
    
          {bagItems.length > 0 && (
                    <div className="section three">
                        <div className="blocks" data-blocks="1">
                            <div className="block">
                                <div className="totals">
                    <table border="0" cellSpacing="0" cellPadding="0">
                                        <tbody>
                                            <tr>
                                                <td>Subtotal</td>
                          <td>€{subtotal.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="block">
                                <div className="buttons">
                                    <div className="button medium" data-button="1A">
                      <a 
                        className="action" 
                        href="/checkout" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCheckout(e);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="text">Go To Checkout</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        <div 
          ref={overlayRef}
          onClick={handleCloseBag}
        ></div>
    </div>
  );
}
