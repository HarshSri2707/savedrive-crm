import content from "@/data/content.json";
import { SITE_URL } from "@/lib/site";

// The contact page itself is a client component (form state), so its metadata
// lives here in a server-side segment layout. This passthrough layout renders
// the page unchanged — no UI impact.
export const metadata = {
  title: "Contact Us",
  description:
    "Have questions about car insurance? Contact the Smart Cover Auto team — we're here to help you compare coverage and find the right policy.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Smart Cover Auto",
    description:
      "Have questions about car insurance? Contact the Smart Cover Auto team — we're here to help.",
    url: `${SITE_URL}/contact`,
  },
  twitter: {
    title: "Contact Us | Smart Cover Auto",
    description:
      "Have questions about car insurance? Contact the Smart Cover Auto team — we're here to help.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us",
  url: `${SITE_URL}/contact`,
  description: content.site.tagline,
  isPartOf: { "@id": `${SITE_URL}/#website` },
};

export default function ContactLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
