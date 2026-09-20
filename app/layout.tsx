import PageTransition from './components/PageTransition'
import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/nav";

export const metadata: Metadata = {
  title: "Coach Booking Site",
  description: "Book a coaching session",
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