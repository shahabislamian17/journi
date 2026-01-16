import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import Navigation from "../../components/layouts/inc/layouts/account/global/Navigation";
import Panel from "../../components/layouts/inc/layouts/account/profile/Panel";
import { authAPI } from "../../lib/api";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../../lib/templates");
  
  let user = null;
  
  try {
    // Get token from cookies or headers
    const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
      const userData = await authAPI.getMe({ token });
      user = userData.user || null;
      } catch (apiError) {
        console.error('Error fetching user from API:', apiError);
        // Don't redirect if API fails - let client-side try to fetch
        // User might have token in localStorage but not in cookies
      }
    }
    // If no token or API failed, user stays null and client-side will try to fetch
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    // Don't redirect on error - let client-side handle it
  }

  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "global/menu.html", "inc/layouts/account/profile/breadcrumbs.html", "inc/layouts/account/profile/panel.html", "inc/layouts/global/bag.html", "inc/layouts/global/calendar.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html"]);
  return {
    props: {
      user,
      templates,
      layoutOptions: {
        title: "Profile | Account | Journi",
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

function escapeForTemplateLiteral(str) {
  return (str || "").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

export default function Page({ user, templates, layoutOptions, needsDates, inlineScripts }) {
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">

        

<Template html={templates["inc/layouts/global/notifications.html"]} />



    </section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/account/profile/breadcrumbs.html"]} />



    </section>

    <section className="profile">

        <section className="navigation">

            <Navigation />

        </section>

        <section className="panel">

            <Panel user={user} />

        </section>

    </section>

    <section className="bag">

        

<Template html={templates["inc/layouts/global/bag.html"]} />



    </section>

    <section className="calendar">

        

<Template html={templates["inc/layouts/global/calendar.html"]} />



    </section>
      
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
    </Layout>
  );
}
