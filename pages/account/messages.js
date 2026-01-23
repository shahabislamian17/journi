import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import Navigation from "../../components/layouts/inc/layouts/account/global/Navigation";
import DynamicPanel from "../../components/layouts/inc/layouts/account/messages/DynamicPanel";
import { conversationsAPI, authAPI } from "../../lib/api";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../../lib/templates");
  
  let conversations = [];
  let user = null;
  
  try {
    // Get token from cookies/headers
    const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Get user for Navigation
      try {
        const userData = await authAPI.getMe({ token });
        user = userData?.user || null;
      } catch (userError) {
        console.error('Error fetching user:', userError);
      }
      
      // Fetch conversations with token
      try {
        const conversationsData = await conversationsAPI.getAll({ token });
        conversations = conversationsData?.conversations || [];
      } catch (convError) {
        console.error('Error fetching conversations:', convError);
      }
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    // Continue without conversations if not authenticated
  }
  
  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "global/menu.html", "inc/layouts/account/global/navigation.html", "inc/layouts/account/messages/breadcrumbs.html", "inc/layouts/account/messages/panel.html", "inc/layouts/global/bag.html", "inc/layouts/global/calendar.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html"]);
  
  return {
    props: {
      conversations,
      templates,
      layoutOptions: {
        title: "Messages | Account | Journi",
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

export default function Page({ conversations, templates, layoutOptions, needsDates, inlineScripts }) {
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">

        

<Template html={templates["inc/layouts/global/notifications.html"]} />



    </section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/account/messages/breadcrumbs.html"]} />



    </section>

    <section className="messages">

        <section className="navigation">

            

          <Navigation />



        </section>

        <section className="panel">
          <DynamicPanel initialConversations={conversations} />
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
