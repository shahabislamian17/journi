import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import Prompt from "../../components/layouts/inc/layouts/checkout/confirmation/Prompt";

export async function getServerSideProps() {
  // Dynamic import to ensure this only runs on the server
  const { readTemplates } = await import("../../lib/templates");
  
  const templates = readTemplates([
    "global/announcements.html", 
    "global/footer-base.html", 
    "global/footer-section-three.html", 
    "global/header.html", 
    "inc/layouts/checkout/confirmation/breadcrumbs.html", 
    "inc/layouts/global/bag.html", 
    "inc/layouts/global/concierge.html", 
    "inc/layouts/global/dates.html", 
    "inc/layouts/global/notifications.html", 
    "inc/layouts/global/reviews.html", 
    "inc/layouts/global/search.html"
  ]);
  return {
    props: {
      templates,
      layoutOptions: {
        title: "Confirmation | Checkout | Journi",
        pageClass: "confirmation",
        includeCalendarCss: true,
        includeCalendarJs: true,
        showCalendarButton: true,
        showAnnouncements: false,
      },
      needsDates: true,
      inlineScripts: [],
    },
  };
}

// Helper function for template literal escaping (doesn't need fs)
function escapeForTemplateLiteral(str) {
  return (str || "").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

export default function Page({ templates, layoutOptions, needsDates }) {
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Template html={templates["inc/layouts/global/notifications.html"]} />
      </section>

      <section className="search">
        <Template html={templates["inc/layouts/global/search.html"]} />
      </section>

      <section className="breadcrumbs">
        <Template html={templates["inc/layouts/checkout/confirmation/breadcrumbs.html"]} />
      </section>

      <section className="prompt">
        <Prompt />
      </section>

      <section className="bag">
        <Template html={templates["inc/layouts/global/bag.html"]} />
      </section>

      <section className="reviews">
        <Template html={templates["inc/layouts/global/reviews.html"]} />
      </section>

      <section className="concierge">
        <Template html={templates["inc/layouts/global/concierge.html"]} />
      </section>
      
      <Script id="dates-template" strategy="afterInteractive">
        {`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}
      </Script>
    </Layout>
  );
}
