import React, { useEffect, useRef } from 'react';
import { reviewsAPI } from '../lib/api';

// Helper function to get initials from name
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
}

// Helper function to split comment into paragraphs
function splitComment(comment) {
  if (!comment) return [];
  return comment.split('\n\n').filter(p => p.trim());
}

export default function Reviews({ reviews: initialReviews = [] }) {
  const [reviews, setReviews] = React.useState(initialReviews);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Fetch website reviews if not provided via props
    if (!initialReviews || initialReviews.length === 0) {
      reviewsAPI.getWebsiteFeatured()
        .then(data => {
          if (data.reviews) {
            setReviews(data.reviews);
          }
        })
        .catch(error => {
          console.error('Failed to fetch website reviews:', error);
        });
    }
  }, [initialReviews]);

  // Initialize Swiper for the slider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper && sliderRef.current && reviews.length > 0) {
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
          prevEl: '.reviews .slider .navigation .buttons .button.one',
          nextEl: '.reviews .slider .navigation .buttons .button.two',
        },
        pagination: {
          el: '.reviews .slider .pagination .icons',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }
      });
    }
  }, [reviews]);

  if (!reviews || reviews.length === 0) {
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
                  <h2 className="one">Loved by those who love to travel.</h2>
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
                    {reviews.map((review) => {
                      const user = review.user || {};
                      const firstName = user.firstName || '';
                      const lastName = user.lastName || '';
                      const initials = getInitials(firstName, lastName);
                      const commentParagraphs = splitComment(review.comment);
                      const reviewCount = review.reviewCount || 0;
                      const reviewCountText = reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`;

                      return (
                        <div key={review.id} className="slide">
                          <div className="review">
                            <div className="blocks" data-blocks="2">
                              <div className="block" data-block="1A">
                                <div className="profile">
                                  <div className="blocks" data-blocks="3">
                                    <div className="block" data-block="1AA">
                                      <div className="initials">{initials}</div>
                                    </div>
                                    <div className="block" data-block={review.localGuide ? "1AB" : "1AAB"}>
                                      <div className="text">
                                        <span className="one">{firstName} {lastName}</span>
                                        <span className="two">
                                          <span>{reviewCountText}</span>
                                          {review.localGuide && <span>Local Guide</span>}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="block" data-block="1B">
                                <div className="rating">
                                  <div className="blocks" data-blocks="4">
                                    <div className="block" data-block="1BA">
                                      <div className="stars">
                                        <div className="icons">
                                          {Array.from({ length: review.rating || 5 }).map((_, i) => (
                                            <i key={i} className="icons8 icons8-star-2"></i>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="block" data-block="1BB">
                                      <div className="source">
                                        <span className="one">on</span>
                                        <span className="two">
                                          <img src="/assets/images/global/reviews/google.png" width="100%" alt="Google" />
                                        </span>
                                        <span className="three">{review.source || 'Google'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="block" data-block="1C">
                                <div className="text">
                                  {commentParagraphs.map((paragraph, index) => (
                                    <p key={index} className="small three">{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pagination">
                    <div className="icons"></div>
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

