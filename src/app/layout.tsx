import type { Metadata } from "next";
import { Header } from "@/components/header";
import { CursorLight } from "@/components/motion";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
const description = "Full Stack Engineer based in Karachi. I build web and mobile applications, connecting thoughtful interfaces with reliable backend systems.";
export const metadata: Metadata = {
  metadataBase: new URL("https://ifraz-portfolio.vercel.app"),
  title: {
    default: "Ifraz Ali — Full Stack Engineer",
    template: "%s | Ifraz Ali",
  },
  description,
  openGraph: {
    title: "Ifraz Ali — Full Stack Engineer",
    description,
    siteName: "Ifraz Ali",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ifraz Ali — Full Stack Engineer",
    description,
    images: [{ url: "/opengraph-image", alt: "Ifraz Ali — Full Stack Engineer. Web and mobile applications." }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <CursorLight />
      </body>
    </html>
  );
}
