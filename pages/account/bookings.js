import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import { bookingsAPI } from "../../lib/api";
import { escapeForTemplateLiteral } from "../../lib/utils";
import DynamicPanel from "../../components/layouts/inc/layouts/account/bookings/DynamicPanel";
import Bag from "../../components/layouts/inc/layouts/global/Bag";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../../lib/templates");
  
  // Note: Authentication should be handled client-side or via middleware
  // For now, we'll fetch bookings if token is available in cookies/headers
  let bookings = [];
  
  try {
    // In production, get token from cookies/headers
    const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Set token in API request
      const bookingsData = await bookingsAPI.getAll({ token });
      bookings = bookingsData.bookings || [];
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Continue without bookings if not authenticated - let client-side handle it
  }

  const templates = readTemplates([
    "global/announcements.html",
    "global/footer-base.html",
    "global/footer-section-three.html",
    "global/header.html",
    "global/menu.html",
    "inc/layouts/account/bookings/breadcrumbs.html",
    "inc/layouts/account/bookings/panel.html",
    "inc/layouts/account/global/navigation.html",
    "inc/layouts/global/bag.html",
    "inc/layouts/global/calendar.html",
    "inc/layouts/global/dates.html",
    "inc/layouts/global/notifications.html"
  ]);

  return {
    props: {
      bookings,
      templates,
      layoutOptions: {
        title: "Bookings | Account | Journi",
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

export default function Page({ bookings, templates, layoutOptions, needsDates, inlineScripts }) {
  const bookingsJson = JSON.stringify(bookings);

  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Template html={templates["inc/layouts/global/notifications.html"]} />
      </section>

      <section className="breadcrumbs">
        <Template html={templates["inc/layouts/account/bookings/breadcrumbs.html"]} />
      </section>

      <section className="bookings">
        <section className="navigation">
          <Template html={templates["inc/layouts/account/global/navigation.html"]} />
        </section>

        <section className="panel">
          <DynamicPanel initialBookings={bookings} />
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
        __html: `window.__API_BOOKINGS__ = ${bookingsJson};`
      }} />
      
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
    </Layout>
  );
}
