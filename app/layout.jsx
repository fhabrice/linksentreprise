import './globals.css';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://linksmartec.com'),
  title: {
    default: 'Linkstech — Construire. Digitaliser. Impacter.',
    template: '%s | Linkstech',
  },
  description: 'Linkstech, basée en RDC, au Kenya et au Canada, accompagne les entreprises à l’international avec des solutions de construction, de technologie et d’énergie renouvelable, en connectant les services aux clients, les marchés aux entreprises, les ONG aux bailleurs et en ouvrant des partenariats avec toute entreprise qui souhaite collaborer.',
  keywords: ['Linkstech', 'construction', 'génie civil', 'informatique', 'énergie renouvelable', 'solaire', 'partenariats', 'RDC', 'Kenya', 'Canada'],
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
