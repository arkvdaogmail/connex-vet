// app/layout.tsx
import type { Metadata } from "next";
import { WalletProvider } from "@/components/WalletProvider"; // Import the provider
import Header from "@/components/Header"; // Import the new Header
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
}```

### **Step 4: Create the Header Component**

This is the new header that will contain the "Connect Wallet" button.

1.  Go to the `components` folder you created in Step 2.
2.  Create a new file named **`Header.tsx`**.
3.  Copy and paste the following code into it:

```typescript
// components/Header.tsx
"use client";

import { useWallet } from './WalletProvider';

const Header = () => {
    const { account, connectWallet, disconnectWallet, loading } = useWallet();

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <header className="absolute top-0 right-0 p-4">
            {loading ? (
                <button className="bg-gray-500/50 text-white font-bold py-2 px-4 rounded" disabled>
                    Loading...
                </button>
            ) : account ? (
                <div className="flex items-center space-x-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                        {formatAddress(account)}
                    </span>
                    <button onClick={disconnectWallet} className="bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-4 rounded">
                        Disconnect
                    </button>
                </div>
            ) : (
                <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Connect Wallet
                </button>
            )}
        </header>
    );
};

export default Header;

