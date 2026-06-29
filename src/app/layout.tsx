import React from "react";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css"; // assuming global styles are here

export const metadata = {
  title: "Lord of the Archives",
  description: "The ultimate rap battle archive.",
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2858435877591429";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7YLK7S5HW2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7YLK7S5HW2');
          `}
        </Script>
        {ADSENSE_CLIENT && (
          <Script
            id="google-adsense"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-zinc-950 selection:bg-brand selection:text-black text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
