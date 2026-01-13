import Link from 'next/link';
import WishlistButton from './WishlistButton';

export default function CategoryExperiences({ experiences = [], category = null, wishlistIds = [] }) {
  if (!experiences || experiences.length === 0) {
    return (
      <section className="experiences">
        <div className="container">
          <div className="content">
            <div className="blocks" data-blocks="1">
              <div className="block">
                <div className="experiences">
                  <p>No experiences available in this category</p>
                </div>
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
                              <Link href={`/ibiza/sightseeing/experience?slug=${experience.slug}`}>
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
                                    <div className="text">From €{experience.price || '0'}</div>
                                  </div>
                                </div>
                                {(experience.featured || experience.isNew) && (
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
  );
}

