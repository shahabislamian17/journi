'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { experiencesAPI } from '../../../../../lib/api';
import WishlistButton from '../../../../../components/WishlistButton';

export default function DynamicExperiences({ currentExperience }) {
  const [similarExperiences, setSimilarExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get experience data from window if not passed as prop
    let experience = currentExperience;
    if (!experience && typeof window !== 'undefined' && window.__API_EXPERIENCE__) {
      experience = window.__API_EXPERIENCE__;
    }

    if (!experience) {
      setLoading(false);
      return;
    }

    // Fetch similar experiences (same category, exclude current)
    const fetchSimilarExperiences = async () => {
      try {
        setLoading(true);
        
        // Fetch experiences from same category
        const params = {
          category: experience.category?.slug || experience.categoryId,
          limit: 10
        };
        
        const response = await experiencesAPI.getAll(params);
        const experiences = response?.experiences?.data || [];
        
        // Filter out current experience and limit to 5
        const filtered = experiences
          .filter(exp => exp.id !== experience.id && exp.slug !== experience.slug)
          .slice(0, 5);
        
        setSimilarExperiences(filtered);
      } catch (error) {
        console.error('Error fetching similar experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarExperiences();
  }, [currentExperience]);

  // Initialize Swiper slider after experiences load
  useEffect(() => {
    if (similarExperiences.length > 0 && typeof window !== 'undefined' && window.Swiper) {
      // Wait a bit for DOM to update
      setTimeout(() => {
        const sliderElement = document.querySelector('.experience .experiences .slider');
        if (sliderElement && !sliderElement.swiper) {
          // Check if slider already initialized
          try {
            new window.Swiper('.experience .experiences .slider', {
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
                prevEl: '.experience .experiences .slider .navigation .buttons .button.one',
                nextEl: '.experience .experiences .slider .navigation .buttons .button.two',
              },
              breakpoints: {
                0: {
                  speed: 625,
                  spaceBetween: 12,
                  slidesPerView: 2,
                },
                600: {
                  speed: 625,
                  spaceBetween: 16,
                  slidesPerView: 3,
                },
                900: {
                  speed: 625,
                  spaceBetween: 16,
                  slidesPerView: 4,
                },
                1025: {
                  speed: 750,
                  spaceBetween: 16,
                  slidesPerView: 5,
                },
                1250: {
                  speed: 750,
                  spaceBetween: 16,
                  slidesPerView: 5,
                }
              }
            });
          } catch (error) {
            console.error('Error initializing Swiper:', error);
          }
        }
      }, 100);
    }
  }, [similarExperiences]);

  if (loading) {
    return (
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h2 className="one">
                      <span>Similar experiences</span>
                      <span>in Ibiza.</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="section two">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="text">
                    <p>Loading similar experiences...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (similarExperiences.length === 0) {
    return null; // Don't show section if no similar experiences
  }

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="title">
                  <h2 className="one">
                    <span>Similar experiences</span>
                    <span>in Ibiza.</span>
                  </h2>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p>Discover more amazing experiences similar to this one.</p>
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
                    {similarExperiences.map((experience, index) => {
                      const imageUrl = experience.images?.[0]?.medium || 
                                     experience.images?.[0]?.large || 
                                     experience.images?.[0]?.original || 
                                     '/assets/images/experiences/experience-1a.jpg';
                      
                      const expId = experience.id || experience.experienceId || experience._id;
                      
                      if (!expId) {
                        return null;
                      }

                      return (
                        <div key={expId} className="slide" data-block={`${index + 1}A`}>
                          <div className="experience">
                            <div className="blocks" data-blocks="2">
                              <div className="block" data-block="1AA">
                                <div className="banner">
                                  <div className="blocks" data-blocks="3">
                                    <div className="block" data-block="1AAA">
                                      <WishlistButton 
                                        experienceId={expId}
                                      />
                                    </div>
                                    <div className="block" data-block="1AAB">
                                      <Link href={`/ibiza/sightseeing/experience?slug=${experience.slug || experience.id}`}>
                                        <div className="images">
                                          <div 
                                            className="image" 
                                            style={{ backgroundImage: `url('${imageUrl}')` }}
                                          ></div>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="block" data-block="1AB">
                                <Link href={`/ibiza/sightseeing/experience?slug=${experience.slug}`}>
                                  <div className="title">
                                    <h3 className="three">{experience.title}</h3>
                                  </div>
                                </Link>
                              </div>

                              <div className="block" data-block="1AC">
                                <div className="blocks" data-blocks="4">
                                  <div className="block" data-block="1ACA">
                                    <div className="duration">
                                      <div className="text">
                                        {experience.duration && experience.duration.trim() 
                                          ? experience.duration 
                                          : (experience.hours 
                                              ? `${experience.hours} ${experience.hours === 1 ? 'Hour' : 'Hours'}` 
                                              : 'N/A')}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="block" data-block="1ACB">
                                    <div className="rating">
                                      <div className="icon">
                                        <i className="icons8 icons8-star-2"></i>
                                      </div>
                                      <div className="text">{experience.rating?.toFixed(1) || '0.0'}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="block" data-block="1AD">
                                <div className="blocks" data-blocks="5">
                                  <div className="block" data-block="1ADA">
                                    <div className="price">
                                      <div className="text">From €{experience.price || '0'}</div>
                                    </div>
                                  </div>
                                  <div className="block" data-block="1ADB">
                                    <div className="labels">
                                      {experience.featured && <div className="label">Featured</div>}
                                      {experience.isNew && <div className="label">New</div>}
                                    </div>
                                  </div>
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
  );
}

