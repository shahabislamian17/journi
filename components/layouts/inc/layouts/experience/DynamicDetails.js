'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExperienceReviews from './ExperienceReviews';
import { bagAPI } from '../../../../../lib/bag';

export default function DynamicDetails({ experience, reviews = [] }) {
  const router = useRouter();
  const [experienceData, setExperienceData] = useState(experience);

  useEffect(() => {
    // Get experience data from window if not passed as prop
    if (!experienceData && typeof window !== 'undefined' && window.__API_EXPERIENCE__) {
      setExperienceData(window.__API_EXPERIENCE__);
    }
  }, [experienceData]);

  if (!experienceData) {
    return <div>Loading experience details...</div>;
  }

  // Parse JSON fields
  // Get languages from host user if available, otherwise from experience
  let languages = [];
  if (experienceData.host && experienceData.host.languages) {
    try {
      languages = typeof experienceData.host.languages === 'string' 
        ? JSON.parse(experienceData.host.languages) 
        : experienceData.host.languages;
    } catch (e) {
      languages = [];
    }
  } else if (experienceData.languages) {
    try {
      languages = typeof experienceData.languages === 'string' 
        ? JSON.parse(experienceData.languages) 
        : experienceData.languages;
    } catch (e) {
      languages = [];
    }
  }
  
  // Parse includedItems if it's a JSON string, otherwise use as array
  let includedItems = [];
  if (experienceData.includedItems) {
    try {
      includedItems = typeof experienceData.includedItems === 'string' 
        ? JSON.parse(experienceData.includedItems) 
        : experienceData.includedItems;
      // Ensure it's an array
      if (!Array.isArray(includedItems)) {
        includedItems = [];
      }
    } catch (e) {
      includedItems = [];
    }
  }
  
  const availabilitySlots = experienceData.availabilitySlots || [];
  
  // Debug logging for availability slots
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[DynamicDetails] Availability slots:', {
      count: availabilitySlots.length,
      slots: availabilitySlots.map(slot => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
        available: slot.available
      }))
    });
  }
  
  // Parse itinerary if it's a JSON string, otherwise use as text
  let itineraryItems = [];
  try {
    if (typeof experienceData.itinerary === 'string') {
      itineraryItems = JSON.parse(experienceData.itinerary);
    } else if (Array.isArray(experienceData.itinerary)) {
      itineraryItems = experienceData.itinerary;
    }
  } catch (e) {
    // If not JSON, treat as plain text
    if (experienceData.itinerary) {
      itineraryItems = [{ description: experienceData.itinerary }];
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getLanguageFlag = (lang) => {
    const flags = {
      'English': '/assets/images/global/languages/english.png',
      'Spanish': '/assets/images/global/languages/spanish.png',
      'French': '/assets/images/global/languages/french.png',
      'German': '/assets/images/global/languages/german.png',
      'Italian': '/assets/images/global/languages/italian.png',
      'Portuguese': '/assets/images/global/languages/portuguese.png',
    };
    return flags[lang] || '/assets/images/global/languages/english.png';
  };

  const getIncludedIcons = (type) => {
    const icons = {
      'Food': { icon1: 'icons8-spaghetti', icon2: 'icons8-spaghetti-2' },
      'Drink': { icon1: 'icons8-drink', icon2: 'icons8-wine-bar' },
      'Equipment': { icon1: 'icons8-backpack', icon2: 'icons8-school-backpack' },
      'food': { icon1: 'icons8-spaghetti', icon2: 'icons8-spaghetti-2' },
      'drink': { icon1: 'icons8-drink', icon2: 'icons8-wine-bar' },
      'equipment': { icon1: 'icons8-backpack', icon2: 'icons8-school-backpack' },
    };
    return icons[type] || { icon1: 'icons8-check-mark', icon2: 'icons8-check-mark-2' };
  };

  const getInformationIcon = (type) => {
    const icons = {
      'requirements': 'icons8-checklist',
      'accessibility': 'icons8-accessibility',
      'cancellation': 'icons8-cancel',
    };
    return icons[type] || 'icons8-info';
  };

  const handleSelectSlot = (slot, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (typeof window === 'undefined') {
      console.error('handleSelectSlot: window is undefined');
      return;
    }

    if (!experienceData || !experienceData.id) {
      console.error('handleSelectSlot: experienceData is missing or invalid', experienceData);
      return;
    }

    if (!slot || !slot.id) {
      console.error('handleSelectSlot: slot is missing or invalid', slot);
      return;
    }

    try {
      // Get experience image
      const primaryImage = experienceData.images?.find(img => img.isPrimary) || experienceData.images?.[0];
      const imageUrl = primaryImage?.original || primaryImage?.medium || '/assets/images/experiences/experience-1a.jpg';

      // Prepare bag item
      const slotPrice = slot.price || experienceData.price || 0;
      const guests = 1; // Default to 1 guest, can be made dynamic later
      
      // Normalize date format - ensure it's a string in ISO format
      let dateString;
      if (slot.date instanceof Date) {
        dateString = slot.date.toISOString();
      } else if (typeof slot.date === 'string') {
        // If it's already a string, use it as-is
        dateString = slot.date;
      } else {
        // Fallback to current date if invalid
        dateString = new Date().toISOString();
      }
      
      const bagItem = {
        id: `${experienceData.id}-${slot.id}-${Date.now()}`,
        experienceId: experienceData.id,
        experienceTitle: experienceData.title,
        slug: experienceData.slug,
        slotId: slot.id,
        date: dateString,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slotPrice,
        guests: guests,
        totalPrice: slotPrice * guests,
        image: imageUrl,
      };

      console.log('Adding to bag:', bagItem);

      // Add to bag
      const result = bagAPI.add(bagItem);
      
      if (!result) {
        console.error('Failed to add item to bag');
        return;
      }

      console.log('Item added to bag successfully');
      
      // Open bag sidebar with smooth animation
      const openBagSmoothly = () => {
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
          return true;
        }
        return false;
      };

      // Try to open immediately
      if (!openBagSmoothly()) {
        // If not found immediately, try with a very short delay
        setTimeout(() => {
          if (!openBagSmoothly()) {
            // Last attempt after slightly longer delay
            setTimeout(openBagSmoothly, 100);
          }
        }, 10);
      }
      
      // Force a reload of bag items after adding
      window.dispatchEvent(new CustomEvent('bagUpdated'));
    } catch (error) {
      console.error('Error in handleSelectSlot:', error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            {/* Host Section */}
            <section className="host">
              <div className="container">
                <div className="content">
                  <div className="sections">
                    <div className="section">
                      <div className="blocks" data-blocks="1">
                        <div className="block" data-block="1">
                          <div className="profile">
                            <div className="blocks" data-blocks="2">
                              <div className="block" data-block="1A">
                                <div 
                                  className="image" 
                                  style={{
                                    backgroundImage: `url('${(experienceData.host && experienceData.host.avatar) ? experienceData.host.avatar : (experienceData.hostImage || '/assets/images/global/hosts/placeholder.jpg')}')`
                                  }}
                                ></div>
                              </div>
                              <div className="block" data-block="1B">
                                <div className="title">
                                  <h2 className="two alt">
                                    <span>Hosted by</span>
                                    <span>{(experienceData.host && experienceData.host.firstName && experienceData.host.lastName) 
                                      ? `${experienceData.host.firstName} ${experienceData.host.lastName}` 
                                      : (experienceData.hostName || 'Host')}</span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="block" data-block="2">
                          <div className="languages">
                            <div className="blocks" data-blocks="3">
                              <div className="block" data-block="2A">
                                <div className="text">
                                  {languages.length > 0 
                                    ? `Hosted in ${languages.slice(0, -1).join(', ')}${languages.length > 1 ? ' and ' : ''}${languages[languages.length - 1]}`
                                    : 'Hosted in English'}
                                </div>
                              </div>
                              <div className="block" data-block="2B">
                                <div className="icons">
                                  {(languages.length > 0 ? languages : ['English']).map((lang, idx) => (
                                    <div key={idx} className="icon">
                                      <img src={getLanguageFlag(lang)} width="100%" alt={lang} />
                                    </div>
                                  ))}
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
            </section>

            {/* Itinerary Section */}
            {itineraryItems.length > 0 && (
              <section className="itinerary">
                <a className="anchor" data-anchor="1" name="itinerary"></a>
                <div className="container">
                  <div className="content">
                    <div className="sections">
                      <div className="section">
                        <div className="blocks" data-blocks="1">
                          <div className="block" data-block="1">
                            <div className="title">
                              <h2 className="two">Itinerary</h2>
                            </div>
                          </div>
                          <div className="block" data-block="2">
                            <div className="activities">
                              <div className="blocks" data-blocks="2">
                                {itineraryItems.map((item, idx) => (
                                  <div key={idx} className="block" data-block="2A">
                                    <div className="activity">
                                      <div className="blocks" data-blocks="3">
                                        <div className="block" data-block="2AA">
                                          <div className="icons">
                                            <div className="icon" data-icon="1">
                                              <i className="icons8 icons8-location"></i>
                                            </div>
                                            <div className="icon" data-icon="2">
                                              <i className="icons8 icons8-location-2"></i>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="block" data-block="2AB">
                                          <div className="text">
                                            <p className="small four">
                                              <span>{item.location || item.title || 'Location'}</span>
                                              {item.duration && <span>{item.duration}</span>}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="block" data-block="2AC">
                                          <div className="text">
                                            <p className="small two">{item.description || item.text}</p>
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
                  </div>
                </div>
              </section>
            )}

            {/* Included Items Section */}
            {includedItems.length > 0 && (
              <section className="items">
                <a className="anchor" data-anchor="1" name="included"></a>
                <div className="container">
                  <div className="content">
                    <div className="sections">
                      <div className="section">
                        <div className="blocks" data-blocks="1">
                          <div className="block" data-block="1">
                            <div className="title">
                              <h2 className="two">What&apos;s Included</h2>
                            </div>
                          </div>
                          <div className="block" data-block="2">
                            <div className="items">
                              <div className="blocks" data-blocks="2">
                                {includedItems.map((item, idx) => {
                                  const icons = getIncludedIcons(item.type || item.name);
                                  return (
                                    <div key={idx} className="block" data-block="2A">
                                      <div className="item">
                                        <div className="blocks" data-blocks="3">
                                          <div className="block" data-block="2AA">
                                            <div className="icons">
                                              <div className="icon" data-icon="1">
                                                <i className={`icons8 ${icons.icon1}`}></i>
                                              </div>
                                              <div className="icon" data-icon="2">
                                                <i className={`icons8 ${icons.icon2}`}></i>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="block" data-block="2AB">
                                            <div className="title">
                                              <h3 className="one">{item.type || item.name}</h3>
                                            </div>
                                          </div>
                                          <div className="block" data-block="2AC">
                                            <div className="text">
                                              <p className="small three">{item.description || item.text}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Location Section */}
            {(experienceData.location || experienceData.locationDetails) && (
              <section className="location">
                <a className="anchor" data-anchor="1" name="location"></a>
                <div className="container">
                  <div className="content">
                    <div className="sections">
                      <div className="section">
                        <div className="blocks" data-blocks="1">
                          <div className="block" data-block="1">
                            <div className="title">
                              <h2 className="two">Location</h2>
                            </div>
                          </div>
                          <div className="block" data-block="2">
                            <div className="text">
                              <p className="small two">{experienceData.locationDetails || experienceData.location}</p>
                            </div>
                            {experienceData.latitude && experienceData.longitude && (
                              <div className="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}>
                                <iframe
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  style={{ border: 0, borderRadius: '8px' }}
                                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${experienceData.latitude},${experienceData.longitude}&zoom=15`}
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section className="reviews">
              <ExperienceReviews experience={experience} reviews={reviews} />
            </section>

            {/* Information Section */}
            <section className="information">
              <a className="anchor" data-anchor="1" name="information"></a>
              <div className="container">
                <div className="content">
                  <div className="sections">
                    <div className="section">
                      <div className="blocks" data-blocks="1">
                        <div className="block" data-block="1">
                          <div className="title">
                            <h2 className="two">Information</h2>
                          </div>
                        </div>
                        <div className="block" data-block="2">
                          <div className="items">
                            <div className="blocks" data-blocks="2">
                              {experienceData.requirements && (
                                <div className="block" data-block="2A">
                                  <div className="item">
                                    <div className="blocks" data-blocks="3">
                                      <div className="block" data-block="2AA">
                                        <div className="icons">
                                          <div className="icon" data-icon="1">
                                            <i className="icons8 icons8-pass"></i>
                                          </div>
                                          <div className="icon" data-icon="2">
                                            <i className="icons8 icons8-pass-2"></i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AB">
                                        <div className="title">
                                          <h3 className="one">Requirements</h3>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AC">
                                        <div className="text">
                                          <p className="small three">{experienceData.requirements}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {experienceData.accessibility && (
                                <div className="block" data-block="2A">
                                  <div className="item">
                                    <div className="blocks" data-blocks="3">
                                      <div className="block" data-block="2AA">
                                        <div className="icons">
                                          <div className="icon" data-icon="1">
                                            <i className="icons8 icons8-jump"></i>
                                          </div>
                                          <div className="icon" data-icon="2">
                                            <i className="icons8 icons8-jump"></i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AB">
                                        <div className="title">
                                          <h3 className="one">Accessibility</h3>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AC">
                                        <div className="text">
                                          <p className="small three">{experienceData.accessibility}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {experienceData.cancellationPolicy && (
                                <div className="block" data-block="2A">
                                  <div className="item">
                                    <div className="blocks" data-blocks="3">
                                      <div className="block" data-block="2AA">
                                        <div className="icons">
                                          <div className="icon" data-icon="1">
                                            <i className="icons8 icons8-cancel"></i>
                                          </div>
                                          <div className="icon" data-icon="2">
                                            <i className="icons8 icons8-cancel-2"></i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AB">
                                        <div className="title">
                                          <h3 className="one">Cancellation</h3>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AC">
                                        <div className="text">
                                          <p className="small three">{experienceData.cancellationPolicy}</p>
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
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Availability Section */}
          <div className="section two">
            <a className="anchor" data-anchor="1" name="availability"></a>
            {availabilitySlots.length > 0 && (
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="blocks" data-blocks="2">
                    <div className="block" data-block="1A">
                      <div className="blocks" data-blocks="3">
                        <div className="block" data-block="1AA">
                          <div className="title">
                            <h2 className="two alt">Availability</h2>
                          </div>
                        </div>
                        <div className="block" data-block="1AB">
                          <div className="labels">
                            <div className="label">
                              <div className="text">Lowest Price Guarantee</div>
                              <div className="icon">?</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block" data-block="1B">
                      <div className="options">
                        <div className="blocks" data-blocks="4">
                          {availabilitySlots.map((slot, idx) => (
                            <div key={slot.id || idx} className="block" data-block="1BA" data-slot-id={slot.id} data-slot-date={slot.date} data-slot-start-time={slot.startTime} data-slot-end-time={slot.endTime} data-slot-price={slot.price || experienceData.price}>
                              <div className="option">
                                <div className="blocks" data-blocks="5">
                                  <div className="block" data-block="1BAA">
                                    <div className="text">
                                      <div className="one">
                                        <span>{formatDate(slot.date)}</span>
                                        {slot.startTime && slot.endTime && (
                                          <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                        )}
                                      </div>
                                      <div className="two">
                                        <span>€{slot.price || experienceData.price} / person</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="block" data-block="1BAB">
                                    <div className="buttons">
                                      <div className="button small" data-button="1A">
                                        <div 
                                          className="action" 
                                          onClick={(e) => handleSelectSlot(slot, e)}
                                          style={{ cursor: 'pointer' }}
                                          data-slot-id={slot.id}
                                        >
                                          <div className="text">Select</div>
                                          <div className="background"></div>
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
            )}
            {/* Payment Protection Section */}
            <div className="blocks" data-blocks="2">
              <div className="block" data-block="2">
                <div className="blocks" data-blocks="6">
                  <div className="block" data-block="2A">
                    <div className="icons">
                      <div className="icon" data-icon="1">
                        <i className="icons8 icons8-protection"></i>
                      </div>
                      <div className="icon" data-icon="2">
                        <i className="icons8 icons8-protect"></i>
                      </div>
                    </div>
                  </div>
                  <div className="block" data-block="2B">
                    <div className="text">
                      <p className="small five">To protect your payment, do not transfer money or communicate outside Journi.</p>
                    </div>
                  </div>
                  <div className="block" data-block="2C">
                    <div className="buttons">
                      <div className="button small" data-button="2A">
                        <a className="action" href={`/account/messages?host=${experienceData.hostId || ''}`}>
                          <div className="text">Message Host</div>
                        </a>
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
  );
}

