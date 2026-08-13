import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ringarogy.com"),
  title: "Ringarogy Group",
  description: "Masters of none, interested in everything. Ringarogy Group is an independent LLC with a long-term interest in hard assets, technology, intellectual property, and human capital.",
  openGraph: {
    title: "Ringarogy Group",
    description: "Masters of none. Interested in everything.",
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1536, height: 804, alt: "Ringarogy Group — Masters of none. Interested in everything." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ringarogy Group",
    description: "Masters of none. Interested in everything.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
