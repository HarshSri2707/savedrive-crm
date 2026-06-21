import content from "@/data/content.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Shared chrome for the public marketing pages (/ and /contact).
// Admin routes live outside this group, so they never get the public Navbar/Footer.
export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar site={content.site} />
      {children}
      <Footer data={content.footer} site={content.site} />
    </>
  );
}
