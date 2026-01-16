import React, { useEffect, useRef } from 'react';
import { carsAPI } from '../lib/api';

export default function Cars({ cars: initialCars = [] }) {
  const [cars, setCars] = React.useState(initialCars);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Fetch cars if not provided via props
    if (!initialCars || initialCars.length === 0) {
      carsAPI.getAll({ featured: true })
        .then(data => {
          if (data.cars) {
            setCars(data.cars);
          }
        })
        .catch(error => {
          console.error('Failed to fetch cars:', error);
        });
    }
  }, [initialCars]);

  // Initialize Swiper for the slider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper && sliderRef.current && cars.length > 0) {
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
          prevEl: '.cars .slider .navigation .buttons .button.one',
          nextEl: '.cars .slider .navigation .buttons .button.two',
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
  }, [cars]);

  if (!cars || cars.length === 0) {
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
                  <h2 className="one">Hire one of our favourite cars for your trip to Ibiza.</h2>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p>Enim ad minim veniam quis ex ea nostrud exercitation ullamco laboris nisi ut aliquip commodo consequat.</p>
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
                    {cars.map((car) => (
                      <div key={car.id} className="slide">
                        <div className="car">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="banner">
                                <a href={car.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
                                  <div className="images">
                                    <div 
                                      className="image" 
                                      style={{ 
                                        backgroundImage: car.image ? `url('${car.image}')` : 'url(\'/assets/images/cars/car-1a.jpg\')',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: car.image ? 'transparent' : '#F5F5F6'
                                      }}
                                    ></div>
                                  </div>
                                </a>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <a href={car.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
                                <div className="title">
                                  <h3 className="four">
                                    <span className="one">{car.name}</span>
                                    <span className="two">{car.type}</span>
                                  </h3>
                                </div>
                              </a>
                            </div>

                            <div className="block" data-block="1C">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="1CA">
                                  <div className="price">
                                    <div className="text">From €{car.price || '0'}</div>
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

