'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { experiencesAPI } from '../../../../../../lib/api';

export default function DynamicPanel({ initialExperiences = [], user = null }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [loading, setLoading] = useState(!initialExperiences || initialExperiences.length === 0);

  useEffect(() => {
    // Get experiences from window if not passed as props
    let experiencesData = initialExperiences;
    if ((!experiencesData || experiencesData.length === 0) && typeof window !== 'undefined' && window.__API_EXPERIENCES__) {
      experiencesData = window.__API_EXPERIENCES__;
      // Filter by hostId if user is available
      if (window.__API_USER__ && window.__API_USER__.role === 'HOST' && window.__API_USER__.id) {
        experiencesData = experiencesData.filter(exp => exp.hostId === window.__API_USER__.id);
      }
      setExperiences(experiencesData);
      setLoading(false);
      return;
    }

    // Fetch experiences client-side if not available
    if ((!experiencesData || experiencesData.length === 0) && typeof window !== 'undefined' && user?.role === 'HOST') {
      const fetchExperiences = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (token) {
            const response = await experiencesAPI.getAll({ limit: 100 });
            const allExperiences = response?.experiences?.data || [];
            // Filter by hostId
            const hostExperiences = allExperiences.filter(exp => exp.hostId === user.id);
            setExperiences(hostExperiences);
          }
        } catch (error) {
          console.error('Error fetching experiences:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchExperiences();
    }
  }, [initialExperiences, user]);

  if (loading) {
    return (
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h1 className="three">Experiences</h1>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="text">
                    <p className="small four">Loading experiences...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="blocks" data-blocks="2">
                  <div className="block" data-block="1A">
                    <div className="title">
                      <h1 className="three">Experiences</h1>
                    </div>
                  </div>
                  <div className="block" data-block="1B">
                    <div className="text">
                      <p className="small four">Quisque faucibus sapien vitae pellentesque sem placerat sit pretium. Lorem ipsum dolor sit amet consectetur pretium.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="buttons">
                  <Link href="/account/experiences/add" className="button small" data-button="1A">
                    <div className="action">
                      <div className="text">Add Experience</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {experiences.length > 0 && (
            <div className="section two">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="experiences">
                    <div className="blocks" data-blocks="2">
                      {experiences.map((experience, index) => {
                        const imageUrl = experience.images?.[0]?.medium || 
                                       experience.images?.[0]?.large || 
                                       experience.images?.[0]?.original || 
                                       '/assets/images/experiences/experience-1a.jpg';
                        const duration = experience.duration || (experience.hours ? `${experience.hours} Hours` : '4 Hours');
                        const rating = experience.rating?.toFixed(1) || '4.7';
                        
                        return (
                          <div key={experience.id || index} className="block" data-block="1A">
                            <div className="experience">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="1AA">
                                  <div className="banner">
                                    <div className="blocks" data-blocks="4">
                                      <div className="block" data-block="1AAA">
                                        <Link href={`/account/experiences/add?id=${experience.id}`}>
                                          <div className="images">
                                            <div className="image" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
                                          </div>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="block" data-block="1AB">
                                  <Link href={`/account/experiences/add?id=${experience.id}`}>
                                    <div className="title">
                                      <h3 className="three">{experience.title || 'Experience'}</h3>
                                    </div>
                                  </Link>
                                </div>
                                <div className="block" data-block="1AC">
                                  <div className="blocks" data-blocks="5">
                                    <div className="block" data-block="1ACA">
                                      <div className="duration">
                                        <div className="text">{duration}</div>
                                      </div>
                                    </div>
                                    <div className="block" data-block="1ACB">
                                      <div className="rating">
                                        <div className="icon">
                                          <i className="icons8 icons8-star-2"></i>
                                        </div>
                                        <div className="text">{rating}</div>
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
          )}
        </div>
      </div>
    </div>
  );
}
