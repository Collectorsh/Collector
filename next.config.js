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
};
