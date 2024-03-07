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
      {
        source: "/create",
        destination: "/mint",
        permanent: true,
      },
      {
        source: "/submissions",
        destination: "/submit",
        permanent: true,
      },
      {
        source: "/nft/:mint",
        destination: "/art/:mint",
        permanent: true,
      },
      {
        source: "/gallery/:username",
        destination: "/:username",
        permanent: true,
      },
      // {
      //   source: "/curations/:curation_name",
      //   destination: "/:username/:curation_name",
      //   permanent: true,
      // },
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
