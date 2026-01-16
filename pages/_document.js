import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Move stylesheets here to avoid Next.js warnings - load synchronously */}
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/icons.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/dates.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/events.css" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://use.fontawesome.com/releases/v6.6.0/css/all.css"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

