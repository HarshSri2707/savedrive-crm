import content from "@/data/content.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Partners from "@/sections/Partners";
import HowItWorks from "@/sections/HowItWorks";
import WhyUs from "@/sections/WhyUs";
import Savings from "@/sections/Savings";
import FAQ from "@/sections/FAQ";
import CTASection from "@/sections/CTASection";

export default function Home() {
  return (
    <>
      <Navbar site={content.site} />
      <main>
        <Hero data={content.hero} site={content.site} />
        <Partners data={content.partners} />
        <HowItWorks data={content.howItWorks} />
        <WhyUs data={content.whyUs} stats={content.stats} reviews={content.reviews} />
        <FAQ data={content.faq} />
        <CTASection data={content.cta} site={content.site} />
      </main>
      <Footer data={content.footer} site={content.site} />
    </>
  );
}
