import type { Metadata } from "next";
import { Yatra_One as YatraOneFont, Rozha_One as RozhaOneFont, Cinzel as CinzelFont, Outfit as OutfitFont } from "next/font/google";
import "./globals.css";

const yatraOne = YatraOneFont({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-yatra",
});

const rozhaOne = RozhaOneFont({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-rozha",
});

const cinzel = CinzelFont({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const outfit = OutfitFont({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Corporate Majdoor ka Baaja | Corporate Radio 📻",
  description: "A soothing sanctuary for overworked corporate majdoors. Continuous soothing Hindi and English music collections to heal your soul.",
  keywords: ["Corporate Radio", "Corporate Majdoor ka Baaja", "Lo-Fi Hindi", "Soothing Music", "Saloon.wtf Hindi", "Chill Beats", "Ashu Tiwari"],
  authors: [{ name: "Ashu Tiwari", url: "https://heyashu.in" }],
  openGraph: {
    title: "Corporate Majdoor ka Baaja | Corporate Radio",
    description: "Soothing tracks for corporate majdoors to escape deadline stress.",
    images: ["https://i.ibb.co/WWWc5S7C/radio.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${yatraOne.variable} ${rozhaOne.variable} ${cinzel.variable} ${outfit.variable}`}>
      <body className="font-outfit antialiased bg-black text-white select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
