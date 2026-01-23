import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import RegisterForm from "../../components/layouts/inc/layouts/account/auth/register/Form";
import Bag from "../../components/layouts/inc/layouts/global/Bag";
import { escapeForTemplateLiteral } from "../../lib/utils";

export async function getStaticProps() {
  const { readTemplates } = await import("../../lib/templates");
  const templates = readTemplates(["global/announcements.html", "global/footer-base.html", "global/footer-section-three.html", "global/header.html", "global/menu.html", "inc/layouts/account/auth/register/breadcrumbs.html", "inc/layouts/global/dates.html", "inc/layouts/global/notifications.html"]);
  return {
    props: {
      templates,
      layoutOptions: {
        title: "Register | Account | Journi",
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
  // SECURITY: Remove email and password from URL immediately on page load (before React renders)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('password') || urlParams.has('email')) {
      urlParams.delete('password');
      urlParams.delete('email');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  }
  
  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">

        

<Template html={templates["inc/layouts/global/notifications.html"]} />



    </section>

    <section className="breadcrumbs">

        

<Template html={templates["inc/layouts/account/auth/register/breadcrumbs.html"]} />



    </section>

    <section className="auth" data-auth="register">
      <RegisterForm />
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
