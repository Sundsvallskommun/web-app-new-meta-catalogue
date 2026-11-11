/* eslint-disable @typescript-eslint/no-require-imports */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  output: 'standalone',
  images: {
    // Closes the /_next/image endpoint (Next 16.2.x RCE/SSRF advisories); remove once Next >= 16.4.1 can run on the servers.
    unoptimized: true,
    remotePatterns: [{ hostname: process.env.DOMAIN_NAME || 'localhost' }],
    formats: ['image/avif', 'image/webp'],
  },
  basePath: process.env.BASE_PATH || '',
  transpilePackages: ['lucide-react'],
  sassOptions: {
    prependData: `$basePath: '${process.env.BASE_PATH || ''}';`,
  },
  experimental: {
    optimizePackageImports: ['@sk-web-gui/core', '@sk-web-gui/react'],
  },
});
