import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <Script strategy="beforeInteractive" id="jquery-sdk" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
