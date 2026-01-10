'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookingsAPI } from '../../../../../../lib/api';

export default function DynamicPanel({ initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(!initialBookings || initialBookings.length === 0);

  useEffect(() => {
    // Get bookings from window if not passed as props
    let bookingsData = initialBookings;
    if ((!bookingsData || bookingsData.length === 0) && typeof window !== 'undefined' && window.__API_BOOKINGS__) {
      bookingsData = window.__API_BOOKINGS__;
      setBookings(bookingsData);
      setLoading(false);
      return;
    }

    // Fetch bookings client-side if not available
    if ((!bookingsData || bookingsData.length === 0) && typeof window !== 'undefined') {
      const fetchBookings = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (token) {
            const response = await bookingsAPI.getAll({ token });
            const fetchedBookings = response?.bookings || [];
            setBookings(fetchedBookings);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [initialBookings]);

  // Group bookings by date
  const groupBookingsByDate = (bookingsList) => {
    const grouped = {};
    bookingsList.forEach(booking => {
      const date = new Date(booking.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });
    return grouped;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Format date for booking number display
  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Get booking number (last 4 digits of ID)
  const getBookingNumber = (id) => {
    return id.slice(-4).toUpperCase();
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'cancelled': 'Cancelled',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  };

  // Separate upcoming and previous bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= now);
  const previousBookings = bookings.filter(b => new Date(b.date) < now);

  const upcomingGrouped = groupBookingsByDate(upcomingBookings);
  const previousGrouped = groupBookingsByDate(previousBookings);

  // Sort dates
  const sortDates = (dates) => {
    return Object.keys(dates).sort((a, b) => new Date(a) - new Date(b));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h1 className="three">Bookings</h1>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="text">
                    <p className="small four">Loading bookings...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h1 className="three">Bookings</h1>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="text">
                    <p className="small four">You don't have any bookings yet. Start exploring experiences to make your first booking!</p>
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
                      <h1 className="three">Bookings</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small four">Manage your upcoming and previous bookings here.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div className="section two">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h2 className="four">Upcoming Bookings</h2>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="bookings">
                    <div className="blocks" data-blocks="2">
                      {sortDates(upcomingGrouped).map((dateKey, dateIndex) => {
                        const dateBookings = upcomingGrouped[dateKey];
                        // Group by location (category) for this date
                        const locationGroups = {};
                        dateBookings.forEach(booking => {
                          const location = booking.experience?.category?.name || 'Ibiza';
                          if (!locationGroups[location]) {
                            locationGroups[location] = [];
                          }
                          locationGroups[location].push(booking);
                        });

                        return Object.keys(locationGroups).map((location, locationIndex) => {
                          const locationBookings = locationGroups[location];
                          const firstBooking = locationBookings[0];
                          const totalAmount = locationBookings.reduce((sum, b) => sum + b.totalPrice, 0);

                          return (
                            <div key={`${dateKey}-${location}`} className="block" data-block="2A">
                              <div className="booking">
                                <div className="blocks" data-blocks="3">
                                  <div className="block" data-block="2AA">
                                    <div className="blocks" data-blocks="4">
                                      <div className="block" data-block="2AAA">
                                        <div className="blocks" data-blocks="5">
                                          <div className="block" data-block="2AAAA">
                                            <div className="title">
                                              <h3 className="one">{location}</h3>
                                            </div>
                                          </div>
                                          <div className="block" data-block="2AAAB">
                                            <div className="details">
                                              <div className="blocks" data-blocks="6">
                                                <div className="block" data-block="2AAABA">
                                                  <div className="text">
                                                    <span>Booking</span>
                                                    <span>#{getBookingNumber(firstBooking.id)}</span>
                                                  </div>
                                                </div>
                                                <div className="block" data-block="2AAABB">
                                                  <div className="text">
                                                    <span>Date</span>
                                                    <span>{formatDateShort(firstBooking.date)}</span>
                                                  </div>
                                                </div>
                                                <div className="block" data-block="2AAABB">
                                                  <div className="text">
                                                    <span>Total</span>
                                                    <span>€{totalAmount.toFixed(2)}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AAB">
                                        <div className="buttons">
                                          <div className="button small" data-button="1A" data-action={firstBooking.id}>
                                            <div className="action">
                                              <div className="text">View Calendar</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="block" data-block="2AB">
                                    <div className="dates">
                                      <div className="blocks" data-blocks="7">
                                        <div className="block" data-block="2ABA">
                                          <div className="date">
                                            <div className="blocks" data-blocks="8">
                                              <div className="block" data-block="2ABAA">
                                                <div className="subtitle">
                                                  <div className="text">{formatDate(dateKey)}</div>
                                                </div>
                                              </div>
                                              <div className="block" data-block="2ABAB">
                                                <div className="experiences">
                                                  <div className="blocks" data-blocks="9">
                                                    {locationBookings.map((booking, bookingIndex) => {
                                                      const imageUrl = booking.experience?.images?.[0]?.medium || 
                                                                     booking.experience?.images?.[0]?.large || 
                                                                     booking.experience?.images?.[0]?.original || 
                                                                     '/assets/images/experiences/experience-1a.jpg';
                                                      const experience = booking.experience;

                                                      return (
                                                        <div key={booking.id} className="block" data-block="2ABABA">
                                                          <div className="experience">
                                                            <div className="blocks" data-blocks="10">
                                                              <div className="block" data-block="2ABABAA">
                                                                <Link className="action" href={`/ibiza/sightseeing/experience?slug=${experience?.slug || experience?.id || 'experience'}`}>
                                                                  <div className="images">
                                                                    <div 
                                                                      className="image" 
                                                                      style={{ backgroundImage: `url('${imageUrl}')` }}
                                                                    ></div>
                                                                  </div>
                                                                </Link>
                                                              </div>
                                                              <div className="block" data-block="2ABABAB">
                                                                <div className="blocks" data-blocks="11">
                                                                  <div className="block" data-block="2ABABABA">
                                                                    <div className="blocks" data-blocks="12">
                                                                      <div className="block" data-block="2ABABABAA">
                                                                        <div className="blocks" data-blocks="13">
                                                                          <div className="block" data-block="2ABABABAAA">
                                                                            <Link href={`/ibiza/sightseeing/experience?slug=${experience?.slug || experience?.id || 'experience'}`}>
                                                                              <div className="title">
                                                                                <h3 className="four">{experience?.title || 'Experience'}</h3>
                                                                              </div>
                                                                            </Link>
                                                                          </div>
                                                                          <div className="block" data-block="2ABABABAAB">
                                                                            <div className="details">
                                                                              <table border="0" cellSpacing="0" cellPadding="0">
                                                                                <tbody>
                                                                                  <tr>
                                                                                    <td>Time</td>
                                                                                    <td>
                                                                                      {new Date(booking.date).toLocaleTimeString('en-GB', { 
                                                                                        hour: '2-digit', 
                                                                                        minute: '2-digit',
                                                                                        hour12: false 
                                                                                      })}
                                                                                    </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                    <td>Guests</td>
                                                                                    <td>{booking.guests}</td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                    <td>Status</td>
                                                                                    <td>{getStatusText(booking.status)}</td>
                                                                                  </tr>
                                                                                </tbody>
                                                                              </table>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                      <div className="block" data-block="2ABABABAB">
                                                                        <div className="price">
                                                                          <div className="text">€{booking.totalPrice.toFixed(2)}</div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                  <div className="block" data-block="2ABABABB">
                                                                    <div className="buttons">
                                                                      {experience?.location && (
                                                                        <div className="button small" data-button="2A">
                                                                          <a className="action" href={`#location-${experience.id}`}>
                                                                            <div className="text">Map</div>
                                                                          </a>
                                                                        </div>
                                                                      )}
                                                                      {experience?.hostId && (
                                                                        <div className="button small" data-button="2A">
                                                                          <a className="action" href={`/account/messages?host=${experience.hostId}`}>
                                                                            <div className="text">Message Host</div>
                                                                          </a>
                                                                        </div>
                                                                      )}
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Previous Bookings */}
          {previousBookings.length > 0 && (
            <div className="section three">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="title">
                    <h2 className="four">Previous Bookings</h2>
                  </div>
                </div>
                <div className="block" data-block="2">
                  <div className="bookings">
                    <div className="blocks" data-blocks="2">
                      {sortDates(previousGrouped).reverse().map((dateKey) => {
                        const dateBookings = previousGrouped[dateKey];
                        // Group by location (category) for this date
                        const locationGroups = {};
                        dateBookings.forEach(booking => {
                          const location = booking.experience?.category?.name || 'Ibiza';
                          if (!locationGroups[location]) {
                            locationGroups[location] = [];
                          }
                          locationGroups[location].push(booking);
                        });

                        return Object.keys(locationGroups).map((location) => {
                          const locationBookings = locationGroups[location];
                          const firstBooking = locationBookings[0];
                          const totalAmount = locationBookings.reduce((sum, b) => sum + b.totalPrice, 0);

                          return (
                            <div key={`${dateKey}-${location}-prev`} className="block" data-block="2A">
                              <div className="booking">
                                <div className="blocks" data-blocks="3">
                                  <div className="block" data-block="2AA">
                                    <div className="blocks" data-blocks="4">
                                      <div className="block" data-block="2AAA">
                                        <div className="blocks" data-blocks="5">
                                          <div className="block" data-block="2AAAA">
                                            <div className="title">
                                              <h3 className="one">{location}</h3>
                                            </div>
                                          </div>
                                          <div className="block" data-block="2AAAB">
                                            <div className="details">
                                              <div className="blocks" data-blocks="6">
                                                <div className="block" data-block="2AAABA">
                                                  <div className="text">
                                                    <span>Booking</span>
                                                    <span>#{getBookingNumber(firstBooking.id)}</span>
                                                  </div>
                                                </div>
                                                <div className="block" data-block="2AAABB">
                                                  <div className="text">
                                                    <span>Date</span>
                                                    <span>{formatDateShort(firstBooking.date)}</span>
                                                  </div>
                                                </div>
                                                <div className="block" data-block="2AAABB">
                                                  <div className="text">
                                                    <span>Total</span>
                                                    <span>€{totalAmount.toFixed(2)}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2AAB">
                                        <div className="buttons">
                                          <div className="button small" data-button="1A" data-action={firstBooking.id}>
                                            <div className="action">
                                              <div className="text">View Calendar</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="block" data-block="2AB">
                                    <div className="dates">
                                      <div className="blocks" data-blocks="7">
                                        <div className="block" data-block="2ABA">
                                          <div className="date">
                                            <div className="blocks" data-blocks="8">
                                              <div className="block" data-block="2ABAA">
                                                <div className="subtitle">
                                                  <div className="text">{formatDate(dateKey)}</div>
                                                </div>
                                              </div>
                                              <div className="block" data-block="2ABAB">
                                                <div className="experiences">
                                                  <div className="blocks" data-blocks="9">
                                                    {locationBookings.map((booking) => {
                                                      const imageUrl = booking.experience?.images?.[0]?.medium || 
                                                                     booking.experience?.images?.[0]?.large || 
                                                                     booking.experience?.images?.[0]?.original || 
                                                                     '/assets/images/experiences/experience-1a.jpg';
                                                      const experience = booking.experience;

                                                      return (
                                                        <div key={booking.id} className="block" data-block="2ABABA">
                                                          <div className="experience">
                                                            <div className="blocks" data-blocks="10">
                                                              <div className="block" data-block="2ABABAA">
                                                                <Link className="action" href={`/ibiza/sightseeing/experience?slug=${experience?.slug || experience?.id || 'experience'}`}>
                                                                  <div className="images">
                                                                    <div 
                                                                      className="image" 
                                                                      style={{ backgroundImage: `url('${imageUrl}')` }}
                                                                    ></div>
                                                                  </div>
                                                                </Link>
                                                              </div>
                                                              <div className="block" data-block="2ABABAB">
                                                                <div className="blocks" data-blocks="11">
                                                                  <div className="block" data-block="2ABABABA">
                                                                    <div className="blocks" data-blocks="12">
                                                                      <div className="block" data-block="2ABABABAA">
                                                                        <div className="blocks" data-blocks="13">
                                                                          <div className="block" data-block="2ABABABAAA">
                                                                            <Link href={`/ibiza/sightseeing/experience?slug=${experience?.slug || experience?.id || 'experience'}`}>
                                                                              <div className="title">
                                                                                <h3 className="four">{experience?.title || 'Experience'}</h3>
                                                                              </div>
                                                                            </Link>
                                                                          </div>
                                                                          <div className="block" data-block="2ABABABAAB">
                                                                            <div className="details">
                                                                              <table border="0" cellSpacing="0" cellPadding="0">
                                                                                <tbody>
                                                                                  <tr>
                                                                                    <td>Time</td>
                                                                                    <td>
                                                                                      {new Date(booking.date).toLocaleTimeString('en-GB', { 
                                                                                        hour: '2-digit', 
                                                                                        minute: '2-digit',
                                                                                        hour12: false 
                                                                                      })}
                                                                                    </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                    <td>Guests</td>
                                                                                    <td>{booking.guests}</td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                    <td>Status</td>
                                                                                    <td>{getStatusText(booking.status)}</td>
                                                                                  </tr>
                                                                                </tbody>
                                                                              </table>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                      <div className="block" data-block="2ABABABAB">
                                                                        <div className="price">
                                                                          <div className="text">€{booking.totalPrice.toFixed(2)}</div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                  <div className="block" data-block="2ABABABB">
                                                                    <div className="buttons">
                                                                      {experience?.location && (
                                                                        <div className="button small" data-button="2A">
                                                                          <a className="action" href={`#location-${experience.id}`}>
                                                                            <div className="text">Map</div>
                                                                          </a>
                                                                        </div>
                                                                      )}
                                                                      {experience?.hostId && (
                                                                        <div className="button small" data-button="2A">
                                                                          <a className="action" href={`/account/messages?host=${experience.hostId}`}>
                                                                            <div className="text">Message Host</div>
                                                                          </a>
                                                                        </div>
                                                                      )}
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        });
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

