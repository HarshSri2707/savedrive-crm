import "./globals.css";
import content from "@/data/content.json";
import { SITE_URL } from "@/lib/site";

const DEFAULT_DESCRIPTION =
  "Compare cheap car insurance quotes from 50+ top-rated insurers instantly. 100% free, no credit check, no obligation. Drivers save an average of $700/year.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "SaveDriveQuotes — Cheap Car Insurance Quotes, Compare & Save up to $700/yr",
    template: "%s | SaveDriveQuotes",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: content.site.name,
  keywords: [
    "car insurance quotes",
    "cheap car insurance",
    "compare car insurance",
    "auto insurance",
    "free insurance quotes",
    "insurance comparison",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: content.site.name,
    title:
      "SaveDriveQuotes — Cheap Car Insurance Quotes, Compare & Save up to $700/yr",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "SaveDriveQuotes — Cheap Car Insurance Quotes, Compare & Save up to $700/yr",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
