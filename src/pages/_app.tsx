import {DESCRIPTION} from '@/config';
import '@/globals.css';
import '@fontsource-variable/source-sans-3';
import '@fontsource-variable/space-grotesk';
import {ThemeProvider} from 'next-themes';
import type {AppProps} from 'next/app';
import Head from 'next/head';

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title key="title">Are We Pomelo Yet?</title>
        <meta key="description" name="description" content={DESCRIPTION} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍋</text></svg>"
        />
      </Head>
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </body>
    </>
  );
}
