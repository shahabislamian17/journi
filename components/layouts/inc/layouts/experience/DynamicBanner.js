'use client';

import { useEffect, useState } from 'react';
import WishlistButton from '../../../../../components/WishlistButton';

export default function DynamicBanner({ experience }) {
  const [experienceData, setExperienceData] = useState(experience);

  useEffect(() => {
    // Get experience data from window if not passed as prop
    if (!experienceData && typeof window !== 'undefined' && window.__API_EXPERIENCE__) {
      setExperienceData(window.__API_EXPERIENCE__);
    }
  }, [experienceData]);

  // Initialize Swiper after images load
  useEffect(() => {
    if (experienceData?.images && experienceData.images.length > 0 && typeof window !== 'undefined' && window.Swiper) {
      setTimeout(() => {
        const sliderElement = document.querySelector('.experience .banner .slider');
        if (sliderElement && !sliderElement.swiper) {
          try {
            new window.Swiper('.experience .banner .slider', {
              containerModifierClass: 'slide-',
              slideActiveClass: 'active',
              slideBlankClass: 'blank',
              slideClass: 'slide',
              slideNextClass: 'next',
              slidePrevClass: 'previous',
              slideVisibleClass: 'visible',
              wrapperClass: 'slides',
              navigation: {
                disabledClass: 'disabled',
                prevEl: '.experience .banner .slider .navigation .buttons .button.one',
                nextEl: '.experience .banner .slider .navigation .buttons .button.two',
              },
              pagination: {
                bulletClass: 'icon',
                bulletActiveClass: 'active',
                el: '.experience .banner .slider .pagination .icons',
                dynamicBullets: true,
              },
              breakpoints: {
                0: {
                  speed: 625,
                  spaceBetween: 12,
                  slidesPerView: 1,
                },
                600: {
                  speed: 625,
                  spaceBetween: 16,
                  slidesPerView: 1,
                },
                900: {
                  speed: 625,
                  spaceBetween: 16,
                  slidesPerView: 1,
                },
                1025: {
                  speed: 750,
                  spaceBetween: 16,
                  slidesPerView: 2,
                }
              }
            });
          } catch (error) {
            console.error('Error initializing Swiper:', error);
          }
        }
      }, 100);
    }
  }, [experienceData]);

  if (!experienceData) {
    return (
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h1 className="two">Loading...</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = experienceData.images || [];
  const expId = experienceData.id || experienceData.experienceId || experienceData._id;

  // Format duration
  const duration = experienceData.duration && experienceData.duration.trim() 
    ? experienceData.duration 
    : (experienceData.hours 
        ? `${experienceData.hours} ${experienceData.hours === 1 ? 'Hour' : 'Hours'}` 
        : 'N/A');

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="blocks" data-blocks="2">
                  <div className="block" data-block="1A">
                    <div className="labels">
                      {experienceData.featured && <div className="label">Featured</div>}
                      {experienceData.category && (
                        <div className="label">{experienceData.category.name}</div>
                      )}
                    </div>
                  </div>
                  <div className="block" data-block="1B">
                    <div className="title">
                      <h1 className="two">{experienceData.title}</h1>
                    </div>
                  </div>
                  <div className="block" data-block="1C">
                    <div className="blocks" data-blocks="3">
                      <div className="block" data-block="1CA">
                        <div className="blocks" data-blocks="4">
                          <div className="block" data-block="1CAA">
                            <div className="duration">
                              <div className="text">{duration}</div>
                            </div>
                          </div>
                          <div className="block" data-block="1CAB">
                            <div className="rating">
                              <div className="icon">
                                <i className="icons8 icons8-star-2"></i>
                              </div>
                              <div className="text">{experienceData.rating != null ? experienceData.rating : '0'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="block" data-block="1CB">
                        <div className="overview">
                          <div className="text">
                            <p className="small one">{experienceData.description || ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="slider">
                  <div className="navigation">
                    <div className="buttons">
                      <div className="button circle background alt one">
                        <div className="action">
                          <div className="icon">
                            <i className="icons8 icons8-less-than"></i>
                          </div>
                        </div>
                      </div>
                      <div className="button circle background alt two">
                        <div className="action">
                          <div className="icon">
                            <i className="icons8 icons8-more-than"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="slides">
                    {images.length > 0 ? (
                      images.map((image, index) => {
                        const imageUrl = image.medium || image.large || image.original || '/assets/images/experiences/experience-1a.jpg';
                        return (
                          <div key={image.id || index} className="slide">
                            <div className="images">
                              <div 
                                className="image" 
                                style={{ backgroundImage: `url('${imageUrl}')` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Fallback if no images
                      <div className="slide">
                        <div className="images">
                          <div 
                            className="image" 
                            style={{ backgroundImage: `url('/assets/images/experiences/experience-1a.jpg')` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pagination">
                    <div className="icons"></div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                {expId ? (
                  <WishlistButton 
                    experienceId={expId}
                  />
                ) : (
                  <div className="icons">
                    <div className="icon" data-icon="1">
                      <i className="icons8 icons8-heart"></i>
                    </div>
                    <div className="icon" data-icon="2">
                      <i className="icons8 icons8-heart-2"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

