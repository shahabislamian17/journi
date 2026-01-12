'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WishlistButton from './WishlistButton';
import { wishlistAPI } from '../lib/api';

export default function WishlistExperiences({ wishlist: initialWishlist = [] }) {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log initial wishlist data
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('WishlistExperiences - initialWishlist:', initialWishlist);
      console.log('WishlistExperiences - initialWishlist length:', initialWishlist?.length || 0);
      if (initialWishlist.length > 0) {
        console.log('WishlistExperiences - first item:', initialWishlist[0]);
      }
    }
  }, [initialWishlist]);

  // Fetch wishlist client-side if server-side didn't have token
  useEffect(() => {
    const fetchWishlist = async () => {
      // If server-side already provided wishlist, don't fetch
      if (initialWishlist && initialWishlist.length > 0) {
        return;
      }

      // Check if user is authenticated (has token)
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      
      if (!token) {
        return; // User not logged in
      }

      setIsLoading(true);
      try {
        const data = await wishlistAPI.getAll();
        if (data && data.wishlist) {
          setWishlist(data.wishlist);
          console.log('WishlistExperiences - fetched client-side:', data.wishlist.length, 'items');
        }
      } catch (error) {
        // Handle "User not found" or authentication errors gracefully
        if (error.status === 401 || error.message?.includes('User not found') || error.message?.includes('not found')) {
          // User is not authenticated or token is invalid
          // Set wishlist to empty array
          setWishlist([]);
          console.log('WishlistExperiences - user not authenticated, wishlist cleared');
        } else {
          console.error('Error fetching wishlist client-side:', error);
          // On other errors, keep the initial wishlist if available
          if (initialWishlist && initialWishlist.length > 0) {
            setWishlist(initialWishlist);
          } else {
            setWishlist([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [initialWishlist]);

  // Handle removal from wishlist
  const handleRemove = (experienceId) => {
    setWishlist(prev => prev.filter(item => {
      const expId = item.experience?.id || item.id || item.experienceId;
      return expId !== experienceId;
    }));
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <section className="experiences">
        <div className="container">
          <div className="content">
            <div className="sections">
              <div className="section three">
                <section className="list">
                  <div className="container">
                    <div className="content">
                      <div className="blocks" data-blocks="1">
                        <div className="block">
                          <div className="experiences">
                            <p>Your wishlist is empty. Start adding experiences you love!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Extract experiences from wishlist items
  // Each wishlist item from the API has structure: { id, userId, experienceId, experience: {...}, createdAt }
  // We need to extract the 'experience' property from each wishlist item
  const experiences = wishlist
    .map((item, index) => {
      // The API returns wishlist items with an 'experience' property
      if (item.experience) {
        return item.experience;
      }
      // Fallback: if item is already an experience object (shouldn't happen, but handle it)
      if (item.id && (item.title || item.name)) {
        return item;
      }
      console.warn(`WishlistExperiences - item ${index} doesn't have experience property:`, item);
      return null;
    })
    .filter(Boolean);
  
  // Debug: Log wishlist data (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('WishlistExperiences - wishlist items received:', wishlist.length);
    console.log('WishlistExperiences - extracted experiences:', experiences.length);
    if (wishlist.length > 0) {
      console.log('WishlistExperiences - first wishlist item:', wishlist[0]);
      console.log('WishlistExperiences - first experience:', experiences[0]);
    }
    if (wishlist.length > 0 && wishlist.length !== experiences.length) {
      console.warn('WishlistExperiences - mismatch: received', wishlist.length, 'items but extracted', experiences.length, 'experiences');
    }
  }

  return (
    <section className="experiences">
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section three">
              <section className="list">
                <div className="container">
                  <div className="content">
                    <div className="blocks" data-blocks="1">
                      <div className="block">
                        <div className="experiences">
                          <div className="blocks" data-blocks="2">
                            {experiences.map((experience, index) => {
                              const imageUrl = experience.images?.[0]?.medium || 
                                             experience.images?.[0]?.large || 
                                             experience.images?.[0]?.original || 
                                             '/assets/images/experiences/experience-1a.jpg';
                              
                              // Get experience ID - check multiple possible fields
                              const expId = experience.id || experience.experienceId || experience._id;
                              
                              if (!expId) {
                                return null;
                              }
                              
                              return (
                                <div key={expId} className="block" data-block={`${index + 1}A`}>
                                  <div className="experience" data-experience-id={expId}>
                                    <div className="blocks" data-blocks="3">
                                      {/* Banner/Image */}
                                      <div className="block" data-block={`${index + 1}AA`}>
                                        <div className="banner">
                                          <div className="blocks" data-blocks="4">
                                            <div className="block" data-block={`${index + 1}AAA`}>
                                              <WishlistButton 
                                                experienceId={expId} 
                                                initialInWishlist={true}
                                                onRemove={() => handleRemove(expId)}
                                              />
                                            </div>
                                            <div className="block" data-block={`${index + 1}AAB`}>
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

                                      {/* Title */}
                                      <div className="block" data-block={`${index + 1}AB`}>
                                        <Link href={`/ibiza/sightseeing/experience?slug=${experience.slug}`}>
                                          <div className="title">
                                            <h3 className="three">{experience.title}</h3>
                                          </div>
                                        </Link>
                                      </div>

                                      {/* Duration and Rating */}
                                      <div className="block" data-block={`${index + 1}AC`}>
                                        <div className="blocks" data-blocks="5">
                                          <div className="block" data-block={`${index + 1}ACA`}>
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
                                          <div className="block" data-block={`${index + 1}ACB`}>
                                            <div className="rating">
                                              <div className="icon">
                                                <i className="icons8 icons8-star-2"></i>
                                              </div>
                                              <div className="text">{experience.rating?.toFixed(1) || '0.0'}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Price and Labels */}
                                      <div className="block" data-block={`${index + 1}AD`}>
                                        <div className="blocks" data-blocks="6">
                                          <div className="block" data-block={`${index + 1}ADA`}>
                                            <div className="price">
                                              <div className="text">From €{experience.price || '0'}</div>
                                            </div>
                                          </div>
                                          <div className="block" data-block={`${index + 1}ADB`}>
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
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
