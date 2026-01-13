import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import LoginForm from "../../components/layouts/inc/layouts/account/auth/log-in/Form";
import Bag from "../../components/layouts/inc/layouts/global/Bag";
import { escapeForTemplateLiteral } from "../../lib/utils";

export async function getStaticProps() {
  const { readTemplates } = await import("../../lib/templates");

  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "inc/layouts/account/auth/log-in/breadcrumbs.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html"]);
  return {
    props: {
      templates,
      layoutOptions: {
        title: "Log In | Account | Journi",
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


export default function Page({ templates, layoutOptions, needsDates, inlineScripts }) {
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">

        

<Template html={templates["inc/layouts/global/notifications.html"]} />



    </section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/account/auth/log-in/breadcrumbs.html"]} />



    </section>

    <section className="auth" data-auth="log-in">
      <LoginForm />
    </section>

    <section className="bag">
      <Bag />
    </section>
      
      <Script id="dates-template" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`
      }} />
    </Layout>
  );
}
