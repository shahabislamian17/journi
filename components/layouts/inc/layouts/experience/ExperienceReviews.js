'use client';

import { useEffect, useState } from 'react';
import { reviewsAPI } from '../../../../../lib/api';

// Helper function to get initials from name
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
}

// Helper function to format date
function formatReviewDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

// Helper function to calculate average rating
function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

export default function ExperienceReviews({ experience, reviews: initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Fetch reviews if experience ID is available and no initial reviews provided
    if (experience?.id && (!initialReviews || initialReviews.length === 0)) {
      setLoading(true);
      reviewsAPI.getByExperience(experience.id)
        .then(data => {
          if (data.reviews) {
            setReviews(data.reviews);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch experience reviews:', error);
          setLoading(false);
        });
    }
  }, [experience?.id, initialReviews]);

  if (loading) {
    return (
      <section className="reviews">
        <a className="anchor" data-anchor="1" name="reviews"></a>
        <div className="container">
          <div className="content">
            <div className="sections">
              <div className="section">
                <div className="blocks" data-blocks="1">
                  <div className="block" data-block="1">
                    <div className="title">
                      <h2 className="two">
                        <span>Reviews</span>
                        <span>0</span>
                      </h2>
                    </div>
                  </div>
                  <div className="block" data-block="2">
                    <p>Loading reviews...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const averageRating = calculateAverageRating(reviews);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <section className="reviews">
      <a className="anchor" data-anchor="1" name="reviews"></a>
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h2 className="two">
                      <span>Reviews</span>
                      <span>{averageRating}</span>
                    </h2>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="reviews">
                    <div className="blocks" data-blocks="2">
                      {displayedReviews.map((review) => {
                        const user = review.user || {};
                        const firstName = user.firstName || '';
                        const lastName = user.lastName || '';
                        const initials = getInitials(firstName, lastName);
                        const avatar = user.avatar || '/assets/images/global/hosts/placeholder.jpg';
                        const reviewDate = formatReviewDate(review.createdAt);

                        return (
                          <div key={review.id} className="block" data-block="2A">
                            <div className="review">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="2AA">
                                  <div className="profile">
                                    <div className="blocks" data-blocks="4">
                                      <div className="block" data-block="2AAA">
                                        <div 
                                          className="image" 
                                          style={{ backgroundImage: `url('${avatar}')` }}
                                        ></div>
                                      </div>
                                      <div className="block" data-block="2AAB">
                                        <div className="text">
                                          <span className="one">{firstName} {lastName}</span>
                                          <span className="two">{reviewDate}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="block" data-block="2AB">
                                  <div className="rating">
                                    <div className="blocks" data-blocks="5">
                                      <div className="block" data-block="2ABA">
                                        <div className="stars">
                                          <div className="icons">
                                            {Array.from({ length: review.rating || 5 }).map((_, i) => (
                                              <i key={i} className="icons8 icons8-star-2"></i>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="block" data-block="2AC">
                                  <div className="text">
                                    <p className="small two">
                                      {review.comment || 'No comment provided.'}
                                    </p>
                                  </div>
                                </div>
                                <div className="block" data-block="2AD">
                                  <div className="buttons">
                                    <div className="button small" data-button="1A">
                                      <div className="action">
                                        <div className="text">View</div>
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
                  {reviews.length > 4 && !showAll && (
                    <div className="block" data-block="3">
                      <div className="buttons">
                        <div className="button medium" data-button="2A">
                          <button
                            onClick={() => setShowAll(true)}
                            className="action"
                          >
                            <div className="text">Load More</div>
                          </button>
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
    </section>
  );
}
