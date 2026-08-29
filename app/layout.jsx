import './globals.css';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://linksmartec.com'),
  title: {
    default: 'Linkstech — Construire. Digitaliser. Impacter.',
    template: '%s | Linkstech',
  },
  description: 'Linkstech, basée en RDC, au Kenya et au Canada, accompagne les entreprises à l’international avec des solutions de construction et de technologie, en connectant les services aux clients, les marchés aux entreprises et les ONG aux bailleurs de fonds.',
  keywords: ['Linkstech', 'construction', 'génie civil', 'informatique', 'RDC', 'Kenya', 'Canada'],
  openGraph: {
    title: 'Linkstech — Des solutions sans frontières',
    description: 'Construction, ingénierie et technologies numériques en RDC et à l’international.',
    type: 'website',
    locale: 'fr_FR',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#071a2c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}<Script src="/assets/language.js" strategy="afterInteractive" /></body>
    </html>
  );
}
