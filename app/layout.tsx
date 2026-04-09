import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Mas Logistics — We Move What Others Can't Lift",
  description:
    "Premium land, air, and ocean freight logistics. FCL, LCL, air charter, customs brokerage, last-mile delivery and real-time cargo tracking across 180+ coverage zones worldwide.",
  keywords: [
    "freight forwarding",
    "logistics",
    "FCL",
    "LCL",
    "air freight",
    "ocean freight",
    "customs brokerage",
    "last-mile delivery",
  ],
  openGraph: {
    title: "Mas Logistics — We Move What Others Can't Lift",
    description:
      "Premium multimodal freight logistics — land, ocean, and air. Real-time tracking, customs expertise, global coverage.",
    type: "website",
  },
};

import GlobalRevealTracker from "@/components/global/GlobalRevealTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${rajdhani.variable} h-full`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full flex flex-col antialiased">
        <GlobalRevealTracker />
        {children}
      </body>
    </html>
  );
}
