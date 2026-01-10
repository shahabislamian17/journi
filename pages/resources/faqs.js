import Layout from "../components/Layout";
import Template from "../components/Template";
import Script from "next/script";
import { readTemplates, escapeForTemplateLiteral } from "../lib/templates";

export async function getStaticProps() {
  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "inc/layouts/global/bag.html", "inc/layouts/global/concierge.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html", "inc/layouts/global/reviews.html", "inc/layouts/global/search.html", "inc/layouts/resources/faqs/breadcrumbs.html", "inc/layouts/resources/faqs/faqs.html"]);
  return {
    props: {
      templates,
      layoutOptions: {
        title: "FAQs | Journi",
        pageClass: "resources",
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


export default function Page({ templates, layoutOptions, needsDates, inlineScripts }) {
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">

		

<Template html={templates["inc/layouts/global/notifications.html"]} />



	</section>

	<section className="search">

		

<Template html={templates["inc/layouts/global/search.html"]} />



	</section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/resources/faqs/breadcrumbs.html"]} />



    </section>

    <section className="faqs">

        

<Template html={templates["inc/layouts/resources/faqs/faqs.html"]} />



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
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
      
    </Layout>
  );
}
