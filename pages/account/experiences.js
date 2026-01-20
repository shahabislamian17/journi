import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import Navigation from "../../components/layouts/inc/layouts/account/global/Navigation";
import { experiencesAPI, authAPI } from "../../lib/api";
import { escapeForTemplateLiteral } from "../../lib/utils";
import DynamicPanel from "../../components/layouts/inc/layouts/account/experiences/DynamicPanel";
import Bag from "../../components/layouts/inc/layouts/global/Bag";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../../lib/templates");
  
  let experiences = [];
  let user = null;
  
  try {
    // Get token from cookies or headers
    const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Get user to check role
      try {
        const userData = await authAPI.getMe({ token });
        user = userData?.user || null;
        
        // Only fetch experiences if user is a HOST
        if (user?.role === 'HOST') {
          // Fetch experiences (we'll filter by hostId client-side or need to add backend filter)
          const experiencesData = await experiencesAPI.getAll({ limit: 100 });
          // Filter experiences by hostId if available (or we need backend endpoint)
          experiences = (experiencesData?.experiences?.data || []).filter(exp => 
            exp.hostId === user.id || exp.hostId === null // For now, show all or filter by host
          );
        }
      } catch (apiError) {
        console.error('Error fetching user/experiences from API:', apiError);
      }
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
    "inc/layouts/account/experiences/breadcrumbs.html",
    "inc/layouts/account/experiences/panel.html",
    "inc/layouts/account/global/navigation.html",
    "inc/layouts/global/bag.html",
    "inc/layouts/global/calendar.html",
    "inc/layouts/global/dates.html",
    "inc/layouts/global/notifications.html"
  ]);

  return {
    props: {
      experiences,
      user,
      templates,
      layoutOptions: {
        title: "Experiences | Account | Journi",
        pageClass: "account",
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

export default function Page({ experiences, user, templates, layoutOptions, needsDates, inlineScripts }) {
  const experiencesJson = JSON.stringify(experiences);
  const userJson = JSON.stringify(user);

  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Template html={templates["inc/layouts/global/notifications.html"]} />
      </section>

      <section className="breadcrumbs">
        <Template html={templates["inc/layouts/account/experiences/breadcrumbs.html"]} />
      </section>

      <section className="experiences">
        <section className="navigation">
          <Navigation user={user} />
        </section>

        <section className="panel">
          <DynamicPanel initialExperiences={experiences} user={user} />
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
        __html: `window.__API_EXPERIENCES__ = ${experiencesJson}; window.__API_USER__ = ${userJson};`
      }} />
      
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
    </Layout>
  );
}

