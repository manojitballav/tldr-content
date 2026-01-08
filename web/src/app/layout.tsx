import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { SPARedirect } from "@/components/spa-redirect";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TLDR Content | Movies & Shows Discovery",
  description: "Discover movies and shows from India's top streaming platforms. Filter by genre, language, rating, and more.",
  keywords: ["movies", "shows", "streaming", "India", "Bollywood", "OTT", "Netflix", "Prime Video", "Hotstar"],
  authors: [{ name: "TLDR Content" }],
  openGraph: {
    title: "TLDR Content | Movies & Shows Discovery",
    description: "Discover movies and shows from India's top streaming platforms",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <Providers>
          <SPARedirect />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
