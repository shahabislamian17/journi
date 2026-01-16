import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";

export async function getStaticProps() {
  const { readTemplates } = await import("../../lib/templates");
  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "global/menu.html", "inc/layouts/account/global/navigation.html", "inc/layouts/account/messages/breadcrumbs.html", "inc/layouts/account/messages/panel.html", "inc/layouts/global/bag.html", "inc/layouts/global/calendar.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html"]);
  return {
    props: {
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

export default function Page({ templates, layoutOptions, needsDates, inlineScripts }) {
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

            

<Template html={templates["inc/layouts/account/global/navigation.html"]} />



        </section>

        <section className="panel">

            

<Template html={templates["inc/layouts/account/messages/panel.html"]} />



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
