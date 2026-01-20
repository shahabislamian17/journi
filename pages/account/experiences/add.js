import Layout from "../../../components/Layout";
import Template from "../../../components/Template";
import Script from "next/script";
import Navigation from "../../../components/layouts/inc/layouts/account/global/Navigation";
import { experiencesAPI, categoriesAPI, authAPI } from "../../../lib/api";
import { escapeForTemplateLiteral } from "../../../lib/utils";
import ExperienceForm from "../../../components/layouts/inc/layouts/account/experiences/ExperienceForm";
import Bag from "../../../components/layouts/inc/layouts/global/Bag";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../../../lib/templates");
  
  let experience = null;
  let user = null;
  let categories = [];
  const experienceId = context.query.id || null;
  const isEditMode = !!experienceId;
  
  try {
    // Get token from cookies or headers
    const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Get user to check role
      try {
        const userData = await authAPI.getMe({ token });
        user = userData?.user || null;
        
        // Only allow hosts to add/edit experiences
        if (user?.role !== 'HOST') {
          return {
            redirect: {
              destination: '/account/experiences',
              permanent: false,
            },
          };
        }
        
        // Fetch experience if editing
        if (isEditMode && experienceId) {
          try {
            // Get experience by ID with full details including availability slots
            const experienceData = await experiencesAPI.getById(experienceId, { token });
            experience = experienceData?.experience || null;
            
            // Verify host owns this experience (backend also checks, but double-check here)
            if (experience && experience.hostId !== user.id) {
              return {
                redirect: {
                  destination: '/account/experiences',
                  permanent: false,
                },
              };
            }
          } catch (expError) {
            console.error('Error fetching experience:', expError);
            // If 404 or 403, redirect to experiences list
            if (expError.status === 404 || expError.status === 403) {
              return {
                redirect: {
                  destination: '/account/experiences',
                  permanent: false,
                },
              };
            }
          }
        }
        
        // Fetch categories for dropdown
        try {
          const categoriesData = await categoriesAPI.getAll();
          categories = categoriesData?.categories || [];
        } catch (catError) {
          console.error('Error fetching categories:', catError);
        }
      } catch (apiError) {
        console.error('Error fetching user from API:', apiError);
      }
    } else {
      // No token, redirect to login
      return {
        redirect: {
          destination: '/account/log-in',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
  }

  const templates = readTemplates([
    "global/announcements.html",
    "global/footer-base.html",
    "global/footer-section-three.html",
    "global/header.html",
    "global/menu.html",
    "inc/layouts/account/experiences/add/breadcrumbs.html",
    "inc/layouts/account/global/navigation.html",
    "inc/layouts/global/bag.html",
    "inc/layouts/global/calendar.html",
    "inc/layouts/global/dates.html",
    "inc/layouts/global/notifications.html"
  ]);

  return {
    props: {
      experience,
      user,
      categories,
      isEditMode,
      templates,
      layoutOptions: {
        title: isEditMode ? "Edit Experience | Account | Journi" : "Add Experience | Account | Journi",
        pageClass: "account experience",
        includeCalendarCss: true,
        includeCalendarJs: true,
        showCalendarButton: true,
        showAnnouncements: true,
      },
      needsDates: false,
      inlineScripts: [],
    },
  };
}

export default function Page({ experience, user, categories, isEditMode, templates, layoutOptions, needsDates, inlineScripts }) {
  const experienceJson = JSON.stringify(experience);
  const userJson = JSON.stringify(user);
  const categoriesJson = JSON.stringify(categories);

  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Template html={templates["inc/layouts/global/notifications.html"]} />
      </section>

      <section className="breadcrumbs">
        <Template html={templates["inc/layouts/account/experiences/add/breadcrumbs.html"]} />
      </section>

      <section className="experience">
        <section className="navigation">
          <Navigation user={user} />
        </section>

        <section className="panel">
          <ExperienceForm initialExperience={experience} categories={categories} isEditMode={isEditMode} user={user} />
        </section>
      </section>

      <section className="bag">
        <Bag />
      </section>

      <section className="calendar">
        <Template html={templates["inc/layouts/global/calendar.html"]} />
      </section>

      {/* Inject API data for client-side use */}
      <Script id="api-data" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `window.__API_EXPERIENCE__ = ${experienceJson}; window.__API_USER__ = ${userJson}; window.__API_CATEGORIES__ = ${categoriesJson};`
      }} />
      
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
    </Layout>
  );
}

