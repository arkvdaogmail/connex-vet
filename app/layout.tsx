import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKV DAO - Decentralized Proof of Creation",
  description: "Decentralized Proof of Creation & Verification Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

