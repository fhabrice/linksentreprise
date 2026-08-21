/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Autorise la prévisualisation Arena à charger les scripts du serveur de développement.
  allowedDevOrigins: ['*.e2b.app'],
};

export default nextConfig;
