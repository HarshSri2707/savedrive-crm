import { SITE_URL } from "@/lib/site";

// Public, indexable routes. Admin and API routes are intentionally excluded.
export default function sitemap() {
  const routes = ["", "/contact", "/privacy", "/terms"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
