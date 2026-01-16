import React, { useEffect, useRef } from 'react';
import { staysAPI } from '../lib/api';

export default function Stays({ stays: initialStays = [] }) {
  const [stays, setStays] = React.useState(initialStays);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Fetch stays if not provided via props
    if (!initialStays || initialStays.length === 0) {
      staysAPI.getAll({ featured: true })
        .then(data => {
          if (data.stays) {
            setStays(data.stays);
          }
        })
        .catch(error => {
          console.error('Failed to fetch stays:', error);
        });
    }
  }, [initialStays]);

  // Initialize Swiper for the slider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper && sliderRef.current && stays.length > 0) {
      new window.Swiper(sliderRef.current, {
        containerModifierClass: 'slide-',
        slideActiveClass: 'active',
        slideBlankClass: 'blank',
        slideClass: 'slide',
        slideNextClass: 'next',
        slidePrevClass: 'previous',
        slideVisibleClass: 'visible',
        wrapperClass: 'slides',
        speed: 750,
        navigation: {
          disabledClass: 'disabled',
          prevEl: '.stays .slider .navigation .buttons .button.one',
          nextEl: '.stays .slider .navigation .buttons .button.two',
        },
        breakpoints: {
          0: {
            spaceBetween: 12,
            slidesPerView: 1.5,
          },
          600: {
            spaceBetween: 16,
            slidesPerView: 2,
          },
          900: {
            spaceBetween: 16,
            slidesPerView: 4,
          },
          1250: {
            spaceBetween: 16,
            slidesPerView: 4,
          }
        }
      });
    }
  }, [stays]);

  if (!stays || stays.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="title">
                  <h2 className="one">Book one of our favourite stays in Ibiza.</h2>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="slider" ref={sliderRef}>
                  <div className="navigation">
                    <div className="buttons">
                      <div className="button circle one" data-button="2A">
                        <div className="action">
                          <div className="icon">
                            <i className="icons8 icons8-less-than"></i>
                          </div>
                        </div>
                      </div>
                      <div className="button circle two" data-button="2A">
                        <div className="action">
                          <div className="icon">
                            <i className="icons8 icons8-more-than"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="slides">
                    {stays.map((stay) => (
                      <div key={stay.id} className="slide">
                        <div className="stay">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="banner">
                                <a href={stay.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
                                  <div className="images">
                                    <div 
                                      className="image" 
                                      style={{ backgroundImage: `url('${stay.image}')` }}
                                    ></div>
                                  </div>
                                </a>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <a href={stay.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
                                <div className="title">
                                  <h3 className="four">
                                    <span className="one">{stay.name}</span>
                                    <span className="two">{stay.location}</span>
                                  </h3>
                                </div>
                              </a>
                            </div>

                            <div className="block" data-block="1C">
                              <div className="stars">
                                <div className="icons">
                                  {Array.from({ length: stay.rating || 5 }).map((_, i) => (
                                    <i key={i} className="icons8 icons8-star-2"></i>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="block" data-block="1D">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="1DA">
                                  <div className="price">
                                    <div className="text">From €{stay.price || '0'}</div>
                                  </div>
                                </div>
                                <div className="block" data-block="1DB">
                                  <div className="labels">
                                    <div className="label">{stay.type || 'Hotel'}</div>
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
      </div>
    </div>
  );
}

