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
export const metadata: Metadata = {
  title: {
    default: "Ifraz Ali — Full Stack Engineer",
    template: "%s | Ifraz Ali",
  },
  description:
    "Full Stack Engineer based in Karachi. Web, mobile, telehealth, delivery platforms, and AI-assisted applications. Explore projects and freelance work.",
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
