import {Providers} from '@/components/providers';
import '@fontsource-variable/source-sans-3';
import '@fontsource-variable/space-grotesk';
import {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Are We Pomelo Yet?',
  description:
    '"Are we Pomelo yet?" is a crowdsourcing project to collect anonymized data about Discord\'s Pomelo rollout.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍋</text></svg>"
        />
      </head>
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
