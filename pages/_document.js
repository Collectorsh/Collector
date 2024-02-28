import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className=''>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}