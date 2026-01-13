import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Template from "../components/Template";
import Stays from "../components/Stays";
import Cars from "../components/Cars";
import Reviews from "../components/Reviews";
import HomeBanner from "../components/layouts/HomeBanner";
import Search from "../components/layouts/Search";
import Notifications from "../components/layouts/Notifications";
import Bag from "../components/layouts/inc/layouts/global/Bag";
import { experiencesAPI, categoriesAPI, wishlistAPI, staysAPI, carsAPI, reviewsAPI } from "../lib/api";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../lib/templates");

  // Disable caching for this page to ensure fresh data
  context.res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
  );
  context.res.setHeader('Pragma', 'no-cache');
  context.res.setHeader('Expires', '0');

  // Get search parameters from query
  const { destination, checkInDate, checkOutDate, adults, children } = context.query;
  
  // Build search params for API
  const searchParams = {};
  if (destination && destination.trim() !== '') {
    searchParams.destination = destination;
  }
  if (checkInDate && checkInDate.trim() !== '') {
    searchParams.checkInDate = checkInDate;
  }
  if (checkOutDate && checkOutDate.trim() !== '') {
    searchParams.checkOutDate = checkOutDate;
  }
  if (adults) {
    searchParams.adults = parseInt(adults) || 1;
  }
  if (children) {
    searchParams.children = parseInt(children) || 0;
  }

  try {
    // Fetch experiences based on search params or all if no search (featured shows all items)
    const experiencesParams = Object.keys(searchParams).length > 0 
      ? { ...searchParams, limit: 20 }
      : { limit: 100 }; // Show all items for featured/home page
    
    // Fetch featured experiences, categories, stays, cars, and reviews from API
    const [experiencesData, categoriesData, staysData, carsData, reviewsData] = await Promise.all([
      experiencesAPI.getAll(experiencesParams),
      categoriesAPI.getAll().catch(err => {
        console.error('Error fetching categories:', err);
        return { categories: [] };
      }),
      staysAPI.getAll({ featured: 'true' }),
      carsAPI.getAll({ featured: 'true' }),
      reviewsAPI.getWebsiteFeatured({ limit: 6 })
    ]);

    // Log categories data for debugging
    console.log('Categories fetched:', {
      hasCategories: !!categoriesData?.categories,
      categoriesCount: categoriesData?.categories?.length || 0,
      categories: categoriesData?.categories
    });

    // Fetch wishlist if user is authenticated - always fetch fresh
    let wishlistIds = [];
    try {
      const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
      if (token) {
        // Force fresh fetch by adding a timestamp to prevent caching
        const wishlistData = await wishlistAPI.getAll({ token });
        // Extract experience IDs from wishlist items (handle both numeric and UUID formats)
        wishlistIds = (wishlistData.wishlist || []).map(item => {
          const id = item.experienceId || item.experience?.id || item.id;
          // Return as both string and number for flexible comparison
          return id;
        }).filter(Boolean);
      }
    } catch (error) {
      // Wishlist fetch failed, continue without it
      console.error('Error fetching wishlist:', error);
    }

    // Only load essential templates (header, footer, global components)
    const templates = readTemplates([
      "global/announcements.html",
      "global/footer-base.html",
      "global/footer-section-three.html",
      "global/header.html",
      "global/menu.html",
      "inc/layouts/global/bag.html",
      "inc/layouts/global/concierge.html",
      "inc/layouts/global/dates.html",
      "inc/layouts/global/notifications.html",
      "inc/layouts/global/search.html",
      "inc/layouts/home/availability.html",
      "inc/layouts/home/banner.html",
    ]);

    // Ensure categories is always an array
    const categories = Array.isArray(categoriesData?.categories) ? categoriesData.categories : [];
    
    console.log('Props being returned:', {
      experiencesCount: (experiencesData.experiences?.data || []).length,
      categoriesCount: categories.length,
      staysCount: (staysData.stays || []).length,
      carsCount: (carsData.cars || []).length,
      reviewsCount: (reviewsData.reviews || []).length
    });

    return {
      props: {
        experiences: experiencesData.experiences?.data || [],
        totalCount: experiencesData.experiences?.total || null,
        categories: categories,
        stays: staysData.stays || [],
        cars: carsData.cars || [],
        reviews: reviewsData.reviews || [],
        wishlistIds,
        templates,
        layoutOptions: {
          title: "Journi | Coming Soon",
          pageClass: "home",
          includeCalendarCss: false,
          includeCalendarJs: true,
          showCalendarButton: false,
          showAnnouncements: true,
        },
        needsDates: true,
        inlineScripts: [],
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
    
    // Fallback with empty data but preserve structure
    const templates = readTemplates([
      "global/announcements.html",
      "global/footer-base.html",
      "global/footer-section-three.html",
      "global/header.html",
      "global/menu.html",
      "inc/layouts/global/bag.html",
      "inc/layouts/global/concierge.html",
      "inc/layouts/global/dates.html",
      "inc/layouts/global/notifications.html",
      "inc/layouts/global/search.html",
      "inc/layouts/home/availability.html",
      "inc/layouts/home/banner.html",
    ]);

    return {
      props: {
        experiences: [],
        totalCount: 0,
        categories: [],
        stays: [],
        cars: [],
        reviews: [],
        wishlistIds: [],
        templates,
        layoutOptions: {
          title: "Journi | Coming Soon",
          pageClass: "home",
          includeCalendarCss: false,
          includeCalendarJs: true,
          showCalendarButton: false,
          showAnnouncements: true,
        },
        needsDates: true,
        inlineScripts: [],
      },
    };
  }
}

function escapeForTemplateLiteral(str) {
  return (str || "").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

export default function Page({ experiences, totalCount, categories, stays = [], cars = [], reviews = [], wishlistIds = [], templates, layoutOptions, needsDates, inlineScripts }) {
  const router = useRouter();
  const experiencesJson = JSON.stringify(experiences);
  
  // Generate a unique key based on current timestamp to force fresh render
  // This prevents Next.js from using cached props on client-side navigation
  const pageKey = typeof window !== 'undefined' ? Date.now() : Math.random();

  // Redirect experience query parameter to detail page
  useEffect(() => {
    if (typeof window !== 'undefined' && router.query.experience) {
      const slug = router.query.experience;
      // Use the slug as-is (it should be the database slug, not a generated one)
      router.replace(`/ibiza/sightseeing/experience?slug=${encodeURIComponent(slug)}`);
    }
  }, [router]);

  // Force fresh data on page load/reload
  useEffect(() => {
    // Check if this is a page reload (not client-side navigation)
    if (typeof window !== 'undefined' && window.performance) {
      const navigationType = window.performance.getEntriesByType('navigation')[0]?.type;
      // If it's a reload, the data should already be fresh from getServerSideProps
      // But we can force a hard refresh if needed
      if (navigationType === 'reload') {
        // Data is already fresh from server, just ensure no client cache
        router.replace(router.asPath, undefined, { shallow: false });
      }
    }
  }, []); // Run once on mount

  // Refresh page data when navigating back to ensure fresh wishlist state
  useEffect(() => {
    const handleRouteChange = () => {
      // Force refresh of server-side props when route changes
      router.replace(router.asPath, undefined, { scroll: false });
    };

    // Listen for focus event (when user navigates back to tab/window)
    const handleFocus = () => {
      // Refresh wishlist state by triggering a re-fetch
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshWishlist'));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  return (
    <Layout key={pageKey} templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Notifications />
      </section>

      <section className="search">
        <Search />
      </section>

      <section className="banner">
        <HomeBanner />
      </section>

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
                          <li className="active">
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
                                <li key={category.id || index}>
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
                          })() : null}
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
                            <select defaultValue="relevance">
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

              {/* Experiences List - Container for scripts.js to populate */}
              <div className="section three">
                <section className="list">
                  <div className="container">
                    <div className="content">
                      <div className="blocks" data-blocks="1">
                        <div className="block">
                          <div className="experiences">
                            {/* Experiences will be rendered here by scripts.js */}
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

      <section className="stays">
        <Stays stays={stays} />
      </section>

      <section className="cars">
        <Cars cars={cars} />
      </section>

      <section className="bag">
        <Bag />
      </section>

      <section className="reviews">
        <Reviews reviews={reviews} />
      </section>

      <section className="concierge">
        <Template html={templates["inc/layouts/global/concierge.html"]} />
      </section>

      <section className="availability">
        <Template html={templates["inc/layouts/home/availability.html"]} />
      </section>

      {/* Inject API data for client-side use */}
      <Script id="api-data" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `window.__API_EXPERIENCES__ = ${experiencesJson}; window.__API_TOTAL_COUNT__ = ${totalCount !== null && totalCount !== undefined ? totalCount : experiences.length};`
      }} />

      <Script id="dates-template" strategy="afterInteractive">{`
        const DatesTemplate = \`${escapeForTemplateLiteral(
          templates["inc/layouts/global/dates.html"] || ""
        )}\`;
      `}</Script>
    </Layout>
  );
}
