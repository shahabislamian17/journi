import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import Template from "./Template";
import Header from "./Header";

export default function Layout({
  title,
  pageClass,
  includeCalendarCss = true,
  includeCalendarJs = true,
  showCalendarButton = true,
  showAnnouncements = false,
  templates = {},
  children,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.className = pageClass || "";
    }
  }, [pageClass]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.className = "overlay";
    }
  }, []);

  // Inject footer section three (Calendar button) back into the footer markup when needed
  let footerHtml = templates["global/footer-base.html"] || "";
  const footerSectionThree = templates["global/footer-section-three.html"] || "";
  if (showCalendarButton && footerSectionThree) {
    const marker = "\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </footer";
    const idx = footerHtml.indexOf(marker);
    if (idx !== -1) {
      footerHtml = footerHtml.slice(0, idx) + "\n\n" + footerSectionThree + "\n\n" + footerHtml.slice(idx);
    } else {
      footerHtml += "\n" + footerSectionThree;
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/ico" href="/assets/images/global/favicon/favicon.png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FEFEFE" />
        <meta name="api-url" content={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'} />
        <link rel="profile" href="http://gmpg.org/xfn/11" />

        {/* Calendar CSS is conditional - keep it here since it's dynamic */}
        {includeCalendarCss ? (
          <link rel="stylesheet" type="text/css" href="/assets/css/calendar.css" />
        ) : null}
      </Head>

      {/* Match original script ordering as closely as possible */}
      {/* Inject API URL for client-side JavaScript */}
      <Script id="api-url-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{
        __html: `window.NEXT_PUBLIC_API_URL = '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}';`
      }} />
      <Script src="/assets/js/device.js" strategy="beforeInteractive" />
      <Script src="/assets/js/input-focus-handler.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js" strategy="beforeInteractive" />
      <Script 
        src="/assets/js/swiper.js" 
        strategy="afterInteractive"
        onLoad={() => {
          // Load scripts.js after Swiper is confirmed to be loaded
          if (typeof window !== 'undefined' && typeof window.Swiper !== 'undefined') {
            // Check if scripts.js hasn't been loaded yet
            if (!document.querySelector('script[src="/assets/js/scripts.js"]')) {
              const script = document.createElement('script');
              script.src = '/assets/js/scripts.js';
              script.async = true;
              document.body.appendChild(script);
            }
          }
        }}
        onError={() => {
          // Fallback: Load scripts.js even if Swiper fails
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              if (!document.querySelector('script[src="/assets/js/scripts.js"]')) {
                const script = document.createElement('script');
                script.src = '/assets/js/scripts.js';
                script.async = true;
                document.body.appendChild(script);
              }
            }, 1000);
          }
        }}
      />
      
      {/* Fallback: Ensure scripts.js loads even if Swiper takes too long */}
      <Script
        id="scripts-fallback"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              setTimeout(function() {
                if (typeof window !== 'undefined' && !document.querySelector('script[src="/assets/js/scripts.js"]')) {
                  var script = document.createElement('script');
                  script.src = '/assets/js/scripts.js';
                  script.async = true;
                  document.body.appendChild(script);
                }
              }, 2000);
            })();
          `
        }}
      />
      <Script src="https://js.stripe.com/v3" strategy="afterInteractive" />

      {/* Optional checkout announcement bar */}
      {showAnnouncements ? <Template html={templates["global/announcements.html"] || ""} /> : null}

      {/* Global header */}
      <Template html={templates["global/header.html"] || ""} />
      <Header />

      {/* Global search section - sticky below header */}
      <Template html={templates["inc/layouts/global/search.html"] || ""} />

      {/* Global menu drawer */}
      <Template html={templates["global/menu.html"] || ""} />

      {children}

      {/* Footer */}
      <Template html={footerHtml} />

      {/* Overlay section */}
      <section ref={overlayRef}></section>

      {/* Global scripts */}
      {includeCalendarJs ? <Script src="/assets/js/calendar.js" strategy="afterInteractive" /> : null}
      <Script src="/assets/js/search.js" strategy="afterInteractive" />
      {/* scripts.js is loaded dynamically after Swiper loads (see onLoad callback above) */}
      
      {/* Style to make __next div invisible in layout (display: contents makes children appear as direct children of body) */}
      <style jsx global>{`
        #__next {
          display: contents !important;
        }
      `}</style>
      
      {/* Script to remove id from __next div after React finishes rendering */}
      <Script
        id="remove-next-id"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function removeNextId() {
                try {
                  // Wait for React to fully hydrate and all rendering to complete
                  setTimeout(function() {
                    const nextDiv = document.getElementById('__next');
                    if (nextDiv) {
                      nextDiv.removeAttribute('id');
                    }
                  }, 1500);
                } catch (e) {
                  // Ignore errors
                }
              }
              
              // Run after everything is loaded and React has hydrated
              if (document.readyState === 'complete') {
                removeNextId();
              } else {
                window.addEventListener('load', function() {
                  setTimeout(removeNextId, 1000);
                });
              }
              
              // Also remove on route changes (Next.js client-side navigation)
              if (typeof window !== 'undefined' && window.next) {
                var originalPushState = history.pushState;
                history.pushState = function() {
                  originalPushState.apply(history, arguments);
                  setTimeout(removeNextId, 500);
                };
                
                var originalReplaceState = history.replaceState;
                history.replaceState = function() {
                  originalReplaceState.apply(history, arguments);
                  setTimeout(removeNextId, 500);
                };
              }
            })();
          `
        }}
      />
    </>
  );
}
