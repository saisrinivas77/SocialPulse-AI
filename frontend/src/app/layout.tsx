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
    default: "SocialPulse AI — Enterprise Social Media Intelligence",
    template: "%s | SocialPulse AI",
  },
  description:
    "The operating system for social media intelligence. Create, analyze, schedule and optimize every social platform using enterprise AI.",
  applicationName: "SocialPulse AI",
  metadataBase: new URL("https://socialpulse.ai"),
  keywords: [
    "social media analytics",
    "AI dashboard",
    "social growth",
    "content intelligence",
    "marketing insights",
    "enterprise social media",
  ],
  openGraph: {
    title: "SocialPulse AI — Enterprise Social Media Intelligence",
    description: "The operating system for social media intelligence.",
    type: "website",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#FFFFFF] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}