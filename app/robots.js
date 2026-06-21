import { SITE_URL } from "@/lib/site";

// Allow crawling of public pages; keep admin and API routes out of search.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
