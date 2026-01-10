import Layout from "../components/Layout";
import Template from "../components/Template";
import Script from "next/script";
import WishlistExperiences from "../components/WishlistExperiences";
import { escapeForTemplateLiteral } from "../lib/utils";
import { wishlistAPI } from "../lib/api";

export async function getServerSideProps(context) {
  const { readTemplates } = await import("../lib/templates");
  
  let wishlist = [];
  
  try {
    // In production, get token from cookies/headers
    const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      const wishlistData = await wishlistAPI.getAll({ token });
      wishlist = wishlistData.wishlist || [];
      // Debug: Log wishlist data
      console.log('Wishlist page - token found:', !!token);
      console.log('Wishlist page - fetched wishlist items:', wishlist.length);
      if (wishlist.length > 0) {
        console.log('Wishlist page - first item structure:', {
          id: wishlist[0].id,
          experienceId: wishlist[0].experienceId,
          hasExperience: !!wishlist[0].experience,
          experienceId: wishlist[0].experience?.id
        });
      }
    } else {
      console.log('Wishlist page - no token found, wishlist will be empty');
      // If no token, return empty wishlist (user not logged in)
      wishlist = [];
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    // On error, return empty wishlist
    wishlist = [];
  }

  const templates = readTemplates([
    "global/announcements.html",
    "global/footer-base.html",
    "global/footer-section-three.html",
    "global/header.html",
    "inc/layouts/global/bag.html",
    "inc/layouts/global/concierge.html",
    "inc/layouts/global/dates.html",
    "inc/layouts/global/notifications.html",
    "inc/layouts/global/reviews.html",
    "inc/layouts/global/search.html",
    "inc/layouts/wishlist/banner.html",
    "inc/layouts/wishlist/experiences.html"
  ]);

  return {
    props: {
      wishlist,
      templates,
      layoutOptions: {
        title: "Wishlist | Journi",
        pageClass: "wishlist",
        includeCalendarCss: false,
        includeCalendarJs: true,
        showCalendarButton: true,
        showAnnouncements: false,
      },
      needsDates: true,
      inlineScripts: [],
    },
  };
}


export default function Page({ wishlist: serverWishlist, templates, layoutOptions, needsDates, inlineScripts }) {
  const wishlistJson = JSON.stringify(serverWishlist);
  
  // Debug: Log wishlist data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Wishlist page - props.wishlist:', serverWishlist);
    console.log('Wishlist page - wishlist length:', serverWishlist?.length || 0);
  }

  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Template html={templates["inc/layouts/global/notifications.html"]} />
      </section>

      <section className="search">
        <Template html={templates["inc/layouts/global/search.html"]} />
      </section>

      <section className="banner">
        <Template html={templates["inc/layouts/wishlist/banner.html"]} />
      </section>

      <WishlistExperiences wishlist={serverWishlist || []} />

      <section className="bag">
        <Template html={templates["inc/layouts/global/bag.html"]} />
      </section>

      <section className="reviews">
        <Template html={templates["inc/layouts/global/reviews.html"]} />
      </section>

      <section className="concierge">
        <Template html={templates["inc/layouts/global/concierge.html"]} />
      </section>

      {/* Inject API data for client-side use */}
      <Script id="api-data" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `window.__API_WISHLIST__ = ${wishlistJson};`
      }} />

      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
    </Layout>
  );
}
