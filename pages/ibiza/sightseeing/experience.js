import Layout from "../../../components/Layout";
import Template from "../../../components/Template";
import Script from "next/script";
import { escapeForTemplateLiteral } from "../../../lib/utils";
import { experiencesAPI, reviewsAPI } from "../../../lib/api";
import DynamicBanner from "../../../components/layouts/inc/layouts/experience/DynamicBanner";
import DynamicDetails from "../../../components/layouts/inc/layouts/experience/DynamicDetails";
import DynamicExperiences from "../../../components/layouts/inc/layouts/experience/DynamicExperiences";
import Bag from "../../../components/layouts/inc/layouts/global/Bag";

export async function getServerSideProps(context) {
  // Dynamic import to ensure this only runs on the server
  const { readTemplates } = await import("../../../lib/templates");
  
  const slug = context.query.slug;
  const { checkInDate, checkOutDate, adults, children, destination } = context.query;
  let experience = null;
  let reviews = [];
  
  // Build search params for API
  const searchParams = {};
  if (checkInDate) searchParams.checkInDate = checkInDate;
  if (checkOutDate) searchParams.checkOutDate = checkOutDate;
  if (adults) searchParams.adults = adults;
  if (children) searchParams.children = children;
  if (destination) searchParams.destination = destination;
  
  try {
    if (slug) {
      try {
        // Pass search parameters to filter availability slots
        const experienceData = await experiencesAPI.getBySlug(slug, searchParams);
        experience = experienceData?.experience || null;
        
        // Fetch reviews for this experience
        if (experience?.id) {
          try {
            const reviewsData = await reviewsAPI.getByExperience(experience.id);
            reviews = reviewsData?.reviews || [];
          } catch (reviewError) {
            console.error('Error fetching reviews:', reviewError);
            // Continue without reviews
          }
        }
      } catch (apiError) {
        console.error('Error fetching experience from API:', apiError);
        console.error('Error details:', {
          message: apiError.message,
          status: apiError.status,
          slug: slug,
          code: apiError.code,
          name: apiError.name
        });
        
        // Only return 404 if it's a genuine 404 (experience not found)
        // Don't return 404 for database connection errors, timeouts, etc.
        if (apiError.status === 404 && !apiError.message.includes('timeout') && !apiError.message.includes('database') && !apiError.message.includes('connection')) {
          return {
            notFound: true,
          };
        }
        
        // For database connection errors or timeouts, log but don't return 404
        // This allows the page to render with empty experience (will show error state)
        console.error('Database/connection error fetching experience, continuing with null:', apiError.message);
        experience = null;
      }
    }
  } catch (error) {
    console.error('Unexpected error in getServerSideProps:', error);
    // Return 404 for any unexpected errors to prevent showing error page
    return {
      notFound: true,
    };
  }

  // If experience not found, return 404
  if (!experience && slug) {
    return {
      notFound: true,
    };
  }

  const templates = readTemplates([
    "global/announcements.html", 
    "global/footer-base.html", 
    "global/footer-section-three.html", 
    "global/header.html",
    "global/menu.html", 
    "inc/layouts/experience/banner.html", 
    "inc/layouts/experience/breadcrumbs.html", 
    "inc/layouts/experience/details.html", 
    "inc/layouts/experience/experiences.html", 
    "inc/layouts/experience/navigation.html", 
    "inc/layouts/global/bag.html", 
    "inc/layouts/global/calendar.html", 
    "inc/layouts/global/concierge.html", 
    "inc/layouts/global/dates.html", 
    "inc/layouts/global/notifications.html", 
    "inc/layouts/global/search.html"
  ]);
  
  return {
    props: {
      experience,
      reviews,
      templates,
      layoutOptions: {
        title: experience ? `${experience.title} | Sightseeing | Ibiza | Journi` : "Experience | Sightseeing | Ibiza | Journi",
        pageClass: "experience",
        includeCalendarCss: true,
        includeCalendarJs: true,
        showCalendarButton: true,
        showAnnouncements: true,
      },
      needsDates: true,
      inlineScripts: [],
    },
  };
}


export default function Page({ experience, reviews = [], templates, layoutOptions, needsDates, inlineScripts }) {
  const experienceJson = JSON.stringify(experience);
  
  return (
    <Layout templates={templates} {...layoutOptions}>
      {/* Inject experience data for client-side use */}
      {experience && (
        <Script id="api-data" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `window.__API_EXPERIENCE__ = ${experienceJson};`
        }} />
      )}
      <section className="notifications">

		

<Template html={templates["inc/layouts/global/notifications.html"]} />



	</section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/experience/breadcrumbs.html"]} />



    </section>

    <section className="banner">
      <DynamicBanner experience={experience} />
    </section>

    <section className="navigation">

        

<Template html={templates["inc/layouts/experience/navigation.html"]} />



    </section>

    <section className="details">
      <DynamicDetails experience={experience} reviews={reviews} />
    </section>

    <section className="experiences">
      <DynamicExperiences currentExperience={experience} />
    </section>

    <section className="calendar">

        

<Template html={templates["inc/layouts/global/calendar.html"]} />



    </section>

    <section className="bag">
      <Bag />
    </section>

    <section className="concierge">

        

<Template html={templates["inc/layouts/global/concierge.html"]} />



    </section>
      <Script id="dates-template" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`
      }} />
      
    </Layout>
  );
}
