import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  console.log('Service Worker is supported!');
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                      })
                      .catch(error => {
                        console.error('Service Worker registration failed:', error);
                      });
                  });
                } else {
                  console.log('Service Worker is not supported.');
                }
              `,
            }}
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
