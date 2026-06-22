/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force admin pages to be non-cacheable so the browser's back/forward cache
  // (bfcache) can never restore an authenticated view after logout, or the
  // login page after sign-in. `no-store` makes the browser re-request the page,
  // which re-runs the proxy guard and redirects appropriately.
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
