// Central site config for SEO (metadata, canonical, sitemap, robots, JSON-LD).
// Set NEXT_PUBLIC_SITE_URL in the environment to override in production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.savedrivequotes.com"
).replace(/\/$/, "");
