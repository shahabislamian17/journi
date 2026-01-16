import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  // The wrapper div removal is now handled by a script in Layout.js
  // This avoids React/Next.js conflicts during rendering
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
