import Layout from "../components/Layout";
import Template from "../components/Template";
import Checkout from "../components/layouts/inc/layouts/checkout/Checkout";

export async function getServerSideProps() {
  // Dynamic import to ensure this only runs on the server
  const { readTemplates } = await import("../lib/templates");
  
  const templates = readTemplates(["global/header.html", "global/footer-base.html", "global/footer-section-three.html", "global/menu.html"]);
  return {
    props: {
      templates,
      layoutOptions: {
        title: "Checkout | Journi",
        pageClass: "checkout",
        includeCalendarCss: true,
        includeCalendarJs: false,
        showCalendarButton: true,
        showAnnouncements: false, // We're rendering custom announcements above header
      },
      needsDates: false,
      inlineScripts: [],
    },
  };
}

export default function Page({ templates, layoutOptions }) {
  return (
    <>
      {/* 100% Secure Checkout Banner - Above Header */}
      <section className="announcements" style={{ position: 'relative', zIndex: 1000 }}>
        <div className="container">
          <div className="content">
            <div className="sections">
              <div className="section">
                <div className="blocks" data-blocks="1">
                  <div className="block" data-block="1">
                    <div className="slider">
                      <div className="slides">
                        <div className="slide">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">100% Secure Checkout</div>
                            </div>
                            <div className="block" data-block="1B">
                              <div className="text">Powered by Stripe.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    <Layout templates={templates} {...layoutOptions}>
      <section className="payment">
          <Checkout />
    </section>
    </Layout>
    </>
  );
}
