import Layout from "../../components/Layout";
import Template from "../../components/Template";
import Script from "next/script";
import CategoryExperiences from "../../components/CategoryExperiences";
import { escapeForTemplateLiteral } from "../../lib/utils";
import { experiencesAPI, categoriesAPI, wishlistAPI } from "../../lib/api";

export async function getServerSideProps(context) {
  // Dynamic import to ensure this only runs on the server
  const { readTemplates } = await import("../../lib/templates");
  
  // Get category from query parameter or default to 'sightseeing'
  const categorySlug = context.query.category || 'sightseeing';
  
  try {
    // Fetch experiences from API
    const experiencesData = await experiencesAPI.getAll({ 
      category: categorySlug,
      limit: 20 
    });
    
    // Fetch category info
    let categoryData = null;
    try {
      categoryData = await categoriesAPI.getBySlug(categorySlug);
    } catch (error) {
      console.error('Error fetching category:', error);
    }

    // Fetch wishlist if user is authenticated
    let wishlistIds = [];
    try {
      const token = context.req?.cookies?.token || context.req?.headers?.authorization?.replace('Bearer ', '');
      if (token) {
        const wishlistData = await wishlistAPI.getAll({ token });
        wishlistIds = (wishlistData.wishlist || []).map(item => item.experienceId || item.experience?.id);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }

    // Read static templates (only essential ones, experiences are now dynamic)
    const templates = readTemplates([
      "global/announcements.html",
      "global/footer-base.html",
      "global/footer-section-three.html",
      "global/header.html",
      "inc/layouts/category/banner.html",
      "inc/layouts/category/description.html",
      "inc/layouts/global/bag.html",
      "inc/layouts/global/concierge.html",
      "inc/layouts/global/dates.html",
      "inc/layouts/global/notifications.html",
      "inc/layouts/global/reviews.html",
      "inc/layouts/global/search.html"
    ]);

    return {
      props: {
        experiences: experiencesData.experiences?.data || [],
        totalCount: experiencesData.experiences?.total || null,
        category: categoryData?.category || null,
        wishlistIds,
        templates,
        layoutOptions: {
          title: `${categoryData?.category?.name || 'Sightseeing'} | Ibiza | Journi`,
          pageClass: "category",
          includeCalendarCss: false,
          includeCalendarJs: true,
          showCalendarButton: true,
          showAnnouncements: false,
        },
        needsDates: true,
        inlineScripts: [],
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Fallback to static templates if API fails
    const { readTemplates } = await import("../../lib/templates");
    const templates = readTemplates([
      "global/announcements.html",
      "global/footer-base.html",
      "global/footer-section-three.html",
      "global/header.html",
      "global/menu.html",
      "inc/layouts/category/banner.html",
      "inc/layouts/category/description.html",
      "inc/layouts/global/bag.html",
      "inc/layouts/global/concierge.html",
      "inc/layouts/global/dates.html",
      "inc/layouts/global/notifications.html",
      "inc/layouts/global/reviews.html",
      "inc/layouts/global/search.html"
    ]);
    
    return {
      props: {
        experiences: [],
        category: null,
        templates,
        layoutOptions: {
          title: "Sightseeing | Ibiza | Journi",
          pageClass: "category",
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
}


export default function Page({ experiences, totalCount, category, wishlistIds = [], templates, layoutOptions, needsDates, inlineScripts }) {
  // Inject experiences data into the page for client-side rendering
  const experiencesJson = JSON.stringify(experiences);
  const categoryJson = JSON.stringify(category);

  return (
    <Layout templates={templates} {...layoutOptions}>
      <section className="notifications">
        <Template html={templates["inc/layouts/global/notifications.html"]} />
      </section>

      <section className="search">
        <Template html={templates["inc/layouts/global/search.html"]} />
      </section>

      <section className="banner">
        <Template html={templates["inc/layouts/category/banner.html"]} />
      </section>

      <CategoryExperiences 
        experiences={experiences} 
        totalCount={totalCount}
        category={category}
        wishlistIds={wishlistIds}
      />

      <section className="description">
        <Template html={templates["inc/layouts/category/description.html"]} />
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

      {/* Inject API data for client-side use */}
      <Script id="api-data" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.__API_EXPERIENCES__ = ${experiencesJson};
          window.__API_CATEGORY__ = ${categoryJson};
        `
      }} />
      
      <Script id="dates-template" strategy="afterInteractive">{`const DatesTemplate = \`${escapeForTemplateLiteral(templates["inc/layouts/global/dates.html"] || "")}\`;`}</Script>
    </Layout>
  );
}

