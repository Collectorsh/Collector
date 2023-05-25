module.exports = {
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/l/:path*",
        destination: "/search/:path*",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  images: {
    domains: ['cdn.collector.sh'],
  },
};
