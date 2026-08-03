import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SocialPulse AI",
    template: "%s | SocialPulse AI",
  },
  description:
    "Premium AI-powered social media analytics, insights, automation, and growth orchestration.",
  applicationName: "SocialPulse AI",
  metadataBase: new URL("http://localhost:3000"),
  keywords: [
    "social media analytics",
    "AI dashboard",
    "social growth",
    "content intelligence",
    "marketing insights",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} sp-app`}>
        <div className="sp-noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}