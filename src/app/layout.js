import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    themeColor: "#7ed321",
}

export const metadata = {
  title: "Ramazon Taqvimi",
  description: "30 kunlik Ramazon Taqvimi shu yerda",
    robots: "index follow",
    generator: "Ramazon Taqvim",
    manifest: "/manifest.json",
    keywords: ["ramazon taqvimi 2025", "30 kunlik ramazon taqvimi", "saharlik duosi", "iftorlik duosi", "ramazon taqvimi uzbekistan 2025"],
    authors: [
        { name: "Xurrambek Sadriddinov" },
        {
            name: "Xurrambek Sadriddinov",
            url: "https://www.linkedin.com/in/khurrambek-sadriddinov/",
        },
    ],
    icons: [
        { rel: "apple-touch-icon", url: "/icon-192x192.png" },
        { rel: "icon", url: "/icon-192x192.png" },
    ],
    other: {
        "google-site-verification": "S0-kULhITgTMy8t_Y7UcB3TUTohuQn-_Y35aJySRuRg",
        "yandex-verification": "b2fb31e96b0e5764"
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
          <Header />
          {children}
          <SpeedInsights />
          <Analytics />
      </body>
    </html>
  );
}
