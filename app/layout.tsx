import PageTransition from './components/PageTransition'
import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/nav";

export const metadata: Metadata = {
  title: "Instayog Studio | Nervous System Regulation & Spiritual Healing",
  description: "Small shifts in nervous system, profound shifts in life. Explore nervous system regulation, mantra, relationships and spiritual growth with Pragati Singh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Nav />
          <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
