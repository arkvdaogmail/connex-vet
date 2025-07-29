import type { Metadata } from "next";
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKV DAO - Decentralized Proof of Creation", 
  description: "Decentralized Proof of Creation & Verification Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DAppKitProvider
          config={{
            nodeUrl: "https://testnet.veblocks.net/",
            genesis: "test"
          }}
          usePersistence={true}
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
            <main>{children}</main>
          </div>
        </DAppKitProvider>
      </body>
    </html>
  );
}
