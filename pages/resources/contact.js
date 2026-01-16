import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import Reviews from "../../components/Reviews";
import Bag from "../../components/layouts/inc/layouts/global/Bag";
import { reviewsAPI } from "../../lib/api";

export async function getServerSideProps() {
  // Dynamic import to ensure this only runs on the server
  const { readTemplates, escapeForTemplateLiteral } = await import("../../lib/templates");
  
  // Fetch reviews
  let reviews = [];
  try {
    const reviewsData = await reviewsAPI.getWebsiteFeatured({ limit: 6 });
    reviews = reviewsData.reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    reviews = [];
  }
  
  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "global/menu.html", "inc/layouts/global/bag.html", "inc/layouts/global/concierge.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html", "inc/layouts/global/reviews.html", "inc/layouts/global/search.html", "inc/layouts/resources/contact/breadcrumbs.html", "inc/layouts/resources/contact/contact.html"]);
  return {
    props: {
      reviews,
      templates,
      layoutOptions: {
        title: "Contact | Journi",
        pageClass: "resources",
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


export default function Page({ reviews = [], templates, layoutOptions, needsDates, inlineScripts }) {
  // Dynamic import for escapeForTemplateLiteral to avoid bundling issues
  const escapeForTemplateLiteral = (str) => (str || "").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">

        

<Template html={templates["inc/layouts/global/notifications.html"]} />



	</section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/resources/contact/breadcrumbs.html"]} />



    </section>

    <section className="contact">

        

<Template html={templates["inc/layouts/resources/contact/contact.html"]} />



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
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
      
    </Layout>
  );
}
