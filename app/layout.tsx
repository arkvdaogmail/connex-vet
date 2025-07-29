import type { Metadata } from "next";
import { WalletProvider } from "@/components/walletprovider";
import Header from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKV DAO - Decentralized Proof of Creation",
  description: "Decentralized Proof of Creation & Verification Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
            <Header />
            <main>{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
