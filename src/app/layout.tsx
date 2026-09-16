import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mastersal · Vinstraff",
  description: "Offentlig oversikt over vinstraff for mastersal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="nb" className={`${geistSans.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
