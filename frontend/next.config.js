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
    domains: [process.env.DOMAIN_NAME || 'localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  basePath: process.env.BASE_PATH || '',
  sassOptions: {
    prependData: `$basePath: '${process.env.BASE_PATH || ''}';`,
  },
  experimental: {
    swcPlugins: [
      ['swc-plugin-coverage-instrument', {}], // used to instrument code for cypress e2e test coverage
    ],
  },
});
