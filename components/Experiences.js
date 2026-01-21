import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import WishlistButton from './WishlistButton';

export default function Experiences({ experiences = [], categories = [], activeCategory = 'featured', wishlistIds = [], totalCount = null }) {
  const [sortBy, setSortBy] = useState('relevance');

  // Handle sort changes from both React and jQuery
  useEffect(() => {
    const handleDocumentChange = (e) => {
      const select = e.target;
      // Only handle if it's our sort select and value actually changed
      if (select && select.matches('.experiences .sort select') && select.value !== sortBy) {
        console.log('[Experiences] Sort changed via document listener:', select.value);
        setSortBy(select.value);
      }
    };

    // Listen for change events that might come from jQuery
    document.addEventListener('change', handleDocumentChange, true);
    
    return () => {
      document.removeEventListener('change', handleDocumentChange, true);
    };
  }, [sortBy]);

  // Sort experiences based on selected sort option
  const sortedExperiences = useMemo(() => {
    if (!experiences || experiences.length === 0) return [];
    
    const experiencesCopy = [...experiences];
    
    console.log('[Experiences] Sorting by:', sortBy, 'Total experiences:', experiencesCopy.length);
    
    switch (sortBy) {
      case 'popular':
        // Sort by rating (descending), then by number of reviews
        const popularSorted = experiencesCopy.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          const reviewsA = a._count?.reviews || a.reviews?.length || 0;
          const reviewsB = b._count?.reviews || b.reviews?.length || 0;
          
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return reviewsB - reviewsA;
        });
        console.log('[Experiences] Popular sorted:', popularSorted.slice(0, 3).map(e => ({ title: e.title, rating: e.rating })));
        return popularSorted;
        
      case 'newest':
        // Sort by created date (newest first)
        const newestSorted = experiencesCopy.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        console.log('[Experiences] Newest sorted:', newestSorted.slice(0, 3).map(e => ({ title: e.title, createdAt: e.createdAt })));
        return newestSorted;
        
      case 'price-low':
        // Sort by price (ascending)
        const priceLowSorted = experiencesCopy.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        });
        console.log('[Experiences] Price low sorted:', priceLowSorted.slice(0, 3).map(e => ({ title: e.title, price: e.price })));
        return priceLowSorted;
        
      case 'price-high':
        // Sort by price (descending)
        const priceHighSorted = experiencesCopy.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceB - priceA;
        });
        console.log('[Experiences] Price high sorted:', priceHighSorted.slice(0, 3).map(e => ({ title: e.title, price: e.price })));
        return priceHighSorted;
        
      case 'relevance':
      default:
        // Keep original order (relevance/default)
        console.log('[Experiences] Relevance - keeping original order');
        return experiencesCopy;
    }
  }, [experiences, sortBy]);


  if (!experiences || experiences.length === 0) {
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
                            <p>No experiences available</p>
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

  return (
    <section className="experiences">
      <div className="container">
        <div className="content">
          <div className="sections">
            {/* Category Navigation */}
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block">
                  <div className="links">
                    <div className="one">
                      <ul>
                        <li className={activeCategory === 'featured' ? 'active' : ''}>
                          <a className="action" href="/" data-featured-link="true">
                            <div className="blocks" data-blocks="2">
                              <div className="block">
                                <div className="icons">
                                  <div className="icon one">
                                    <i className="icons8 icons8-stars"></i>
                                  </div>
                                  <div className="icon two">
                                    <i className="icons8 icons8-sparkling"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="block">
                                <div className="title">
                                  <h4 className="one">Featured</h4>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                        {categories && categories.length > 0 ? (() => {
                          // Define the desired order (excluding adventure)
                          const categoryOrder = ['sightseeing', 'wellness', 'art-culture', 'entertainment', 'food-drink', 'sports'];
                          
                          // Filter out adventure and sort by desired order
                          const filteredAndSorted = categories
                            .filter(category => category && category.slug && category.slug !== 'adventure')
                            .sort((a, b) => {
                              const indexA = categoryOrder.indexOf(a.slug);
                              const indexB = categoryOrder.indexOf(b.slug);
                              // If both are in the order list, sort by their position
                              if (indexA !== -1 && indexB !== -1) {
                                return indexA - indexB;
                              }
                              // If only one is in the order list, prioritize it
                              if (indexA !== -1) return -1;
                              if (indexB !== -1) return 1;
                              // If neither is in the order list, maintain original order
                              return 0;
                            });

                          return filteredAndSorted.map((category, index) => {
                            // Ensure category has required fields
                            if (!category || !category.id || !category.slug || !category.name) {
                              console.warn('Invalid category:', category);
                              return null;
                            }

                            // Map category slugs to their icons
                            const getCategoryIcons = (slug) => {
                              const iconMap = {
                                'sightseeing': { one: 'icons8-yacht', two: 'icons8-yacht-2' },
                                'wellness': { one: 'icons8-lotus', two: 'icons8-lotus-2' },
                                'art-culture': { one: 'icons8-collectibles', two: 'icons8-collectibles-2' },
                                'entertainment': { one: 'icons8-entertainment', two: 'icons8-theatre-mask' },
                                'food-drink': { one: 'icons8-champagne', two: 'icons8-champagne-2' },
                                'sports': { one: 'icons8-tennis-ball', two: 'icons8-tennis-ball-2' }
                              };
                              return iconMap[slug] || { one: 'icons8-yacht', two: 'icons8-yacht-2' };
                            };

                            const icons = getCategoryIcons(category.slug);

                            return (
                              <li key={category.id || index} className={activeCategory === category.slug ? 'active' : ''}>
                                <a className="action" href={`/ibiza/${category.slug}`}>
                                  <div className="blocks" data-blocks="2">
                                    <div className="block">
                                      <div className="icons">
                                        <div className="icon one">
                                          <i className={`icons8 ${icons.one}`}></i>
                                        </div>
                                        <div className="icon two">
                                          <i className={`icons8 ${icons.two}`}></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="block">
                                      <div className="title">
                                        <h4 className="one">{category.name}</h4>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </li>
                            );
                          });
                        })() : (
                          // Log when categories are missing
                          (() => {
                            if (typeof window !== 'undefined') {
                              console.warn('No categories available to display. Categories prop:', categories);
                            }
                            return null;
                          })()
                        )}
                      </ul>
                    </div>
                    <div className="two">
                      <ul>
                        <li>
                          <a className="action" href="#">
                            <div className="blocks" data-blocks="3">
                              <div className="block">
                                <div className="icons">
                                  <div className="icon one">
                                    <i className="icons8 icons8-filter"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="block">
                                <div className="title">
                                  <h4 className="one">Filters</h4>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Showing Count and Filters */}
            <div className="section two">
              <div className="blocks" data-blocks="1">
                <div className="block">
                  <div className="text">
                    <p className="small five">
                      Showing {experiences.length} of {Math.max(experiences.length, totalCount !== null && totalCount !== undefined ? totalCount : experiences.length)} experiences.
                    </p>
                  </div>
                </div>
                <div className="block">
                  <div className="blocks" data-blocks="2">
                    <div className="block">
                      <div className="sort">
                        <div className="icon">
                          <i className="icons8 icons8-back-and-forth"></i>
                        </div>
                        <div className="text">Sort:</div>
                        <div className="select" data-input="focus">
                          <span className="option"></span>
                          <select 
                            value={sortBy} 
                            onChange={(e) => {
                              const newValue = e.target.value;
                              console.log('[Experiences] Sort changed via React onChange:', newValue);
                              setSortBy(newValue);
                            }}
                          >
                            <option value="relevance">Relevance</option>
                            <option value="popular">Popular</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low To High</option>
                            <option value="price-high">Price: High To Low</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="block">
                      <div className="filter" data-action="filters">
                        <div className="icon">
                          <i className="icons8 icons8-filter"></i>
                        </div>
                        <div className="text">Filters</div>
                      </div>
                    </div>
                    <div className="block">
                      <div className="view">
                        <div className="buttons">
                          <div className="button circle alt" data-button="2A" data-link="list">
                            <div className="action">
                              <div className="icon">
                                <i className="icons8 icons8-index"></i>
                              </div>
                            </div>
                          </div>
                          <div className="button circle alt" data-button="2A" data-link="calendar">
                            <div className="action">
                              <div className="icon">
                                <i className="icons8 icons8-schedule"></i>
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

            {/* Experiences List */}
            <div className="section three">
              <section className="list">
                <div className="container">
                  <div className="content">
                    <div className="blocks" data-blocks="1">
                      <div className="block">
                        <div className="experiences">
                          <div className="blocks" data-blocks="2">
                            {sortedExperiences.map((experience, index) => {
                              const imageUrl = experience.images?.[0]?.medium || 
                                             experience.images?.[0]?.large || 
                                             experience.images?.[0]?.original || 
                                             '/assets/images/experiences/experience-1a.jpg';
                              
                              // Get experience ID - check multiple possible fields
                              const expId = experience.id || experience.experienceId || experience._id;
                              
                              // Ensure experience has an ID
                              if (!expId) {
                                console.warn('Experience missing ID:', { 
                                  experience, 
                                  keys: Object.keys(experience),
                                  id: experience.id,
                                  experienceId: experience.experienceId,
                                  _id: experience._id
                                });
                                return null;
                              }
                              
                              // Check if experience is in wishlist (handle both numeric and UUID IDs)
                              const isInWishlist = wishlistIds.some(wishlistId => {
                                // Compare as strings and numbers to handle all cases
                                return wishlistId === expId || 
                                       String(wishlistId) === String(expId) ||
                                       Number(wishlistId) === Number(expId);
                              });
                              
                              return (
                                <div key={expId} className="block" data-block="1A">
                                  <div className="experience" data-experience-id={expId}>
                                    <div className="blocks" data-blocks="3">
                                      {/* Banner/Image */}
                                      <div className="block" data-block="1AA" style={{ float: 'left', width: '100%', display: 'block' }}>
                                        <div className="banner">
                                         <div className="blocks" data-blocks="4">
                                            <div className="block" data-block="1AAA">
                                              <WishlistButton 
                                                experienceId={expId} 
                                                initialInWishlist={isInWishlist}
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

                                      {/* Title */}
                                      <div className="block" data-block="1AB" style={{ float: 'left', width: '100%', display: 'block' }}>
                                        <Link href={`/ibiza/sightseeing/experience?slug=${experience.slug || experience.id}`}>
                                          <div className="title">
                                            <h3 className="three">{experience.title}</h3>
                                          </div>
                                        </Link>
                                      </div>

                                      {/* Duration and Rating */}
                                      <div className="block" data-block="1AC" style={{ float: 'left', width: '100%', display: 'block', clear: 'both' }}>
                                        <div className="blocks" data-blocks="5">
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
                                              <div className="text">{experience.rating != null ? experience.rating : '0'}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Price and Labels */}
                                      <div className="block" data-block="1AD" style={{ float: 'left', width: '100%', display: 'block', clear: 'both' }}>
                                        <div className="blocks" data-blocks="6">
                                          <div className="block" data-block="1ADA">
                                            <div className="price">
                                              <div className="text">aDFASFSADFASDF €{experience.price || '0'}</div>
                                            </div>
                                          </div>
                                          {((experience.featured === true) || (experience.isNew === true)) && (
                                            <div className="block" data-block="1ADB">
                                              <div className="labels">
                                                {experience.featured && <div className="label">Featured</div>}
                                                {experience.isNew && <div className="label">New</div>}
                                              </div>
                                            </div>
                                          )}
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

