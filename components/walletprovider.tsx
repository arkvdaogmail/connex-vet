// components/WalletProvider.tsx
"use client";

import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';

// This makes the 'connex' object available from the VeWorld wallet
declare global {
    interface Window {
        connex: any;
    }
}

// Define the shape of the wallet context
interface WalletContextType {
    account: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    loading: boolean;
    connex: any;
}

// Create the context with a default value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Create the provider component
export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [connex, setConnex] = useState<any>(null);

    useEffect(() => {
        // Initialize Connex when the component mounts
        if (window.connex) {
            setConnex(window.connex);
        }
        setLoading(false);
    }, []);

    const connectWallet = async () => {
        if (!connex) {
            alert('VeWorld wallet not found. Please install the extension.');
            return;
        }
        try {
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Sign a certificate to prove your identity.'
                }
            };
            const cert = await connex.vendor.sign('cert').request(message);
            if (cert) {
                setAccount(cert.annex.signer);
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    const value = { account, connectWallet, disconnectWallet, loading, connex };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

// Custom hook to use the wallet context easily
export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
