import content from "@/data/content.json";
import { SITE_URL } from "@/lib/site";
import Hero from "@/sections/Hero";
import Partners from "@/sections/Partners";
import HowItWorks from "@/sections/HowItWorks";
import WhyUs from "@/sections/WhyUs";
import Savings from "@/sections/Savings";
import FAQ from "@/sections/FAQ";
import CTASection from "@/sections/CTASection";

export const metadata = {
  description: content.site.tagline,
  alternates: { canonical: "/" },
  openGraph: { url: SITE_URL, description: content.site.tagline },
};

// Organization + WebSite structured data, built only from existing content.json values.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: content.site.name,
      url: SITE_URL,
      description: content.site.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: content.site.name,
      url: SITE_URL,
      description: content.site.tagline,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero data={content.hero} site={content.site} />
        <Partners data={content.partners} />
        <HowItWorks data={content.howItWorks} />
        <WhyUs data={content.whyUs} stats={content.stats} reviews={content.reviews} />
        <FAQ data={content.faq} />
        <CTASection data={content.cta} site={content.site} />
      </main>
    </>
  );
}
