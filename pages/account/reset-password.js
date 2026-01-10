import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import { escapeForTemplateLiteral } from "../../lib/utils";

export async function getStaticProps() {
  const { readTemplates } = await import("../../lib/templates");
  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "inc/layouts/account/auth/reset-password/breadcrumbs.html", "inc/layouts/account/auth/reset-password/form.html", "inc/layouts/global/bag.html", "inc/layouts/global/notifications.html"]);
  return {
    props: {
      templates,
      layoutOptions: {
        title: "Reset Password | Account | Journi",
        pageClass: "account",
        includeCalendarCss: true,
        includeCalendarJs: true,
        showCalendarButton: true,
        showAnnouncements: false,
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

        

<Template html={templates["inc/layouts/account/auth/reset-password/breadcrumbs.html"]} />



    </section>

    <section className="auth" data-auth="reset-password">

        

<Template html={templates["inc/layouts/account/auth/reset-password/form.html"]} />



    </section>

    <section className="bag">

        

<Template html={templates["inc/layouts/global/bag.html"]} />



    </section>
      
      
    </Layout>
  );
}
