const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  output: 'standalone',
  i18n: {
    locales: ['sv'],
    defaultLocale: 'sv',
  },
  images: {
    remotePatterns: [{ hostname: process.env.DOMAIN_NAME || 'localhost' }],
    formats: ['image/avif', 'image/webp'],
  },
  basePath: process.env.BASE_PATH || '',
  sassOptions: {
    prependData: `$basePath: '${process.env.BASE_PATH || ''}';`,
  },
});
