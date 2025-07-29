"use client";
import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';

declare global {
    interface Window { connex: any; }
}

interface WalletContextType {
    account: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    loading: boolean;
    connex: any;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [connex, setConnex] = useState<any>(null);

    useEffect(() => {
        // Check for VeWorld or Sync2 wallet
        const checkWallet = () => {
            if (typeof window !== 'undefined') {
                if (window.connex) {
                    setConnex(window.connex);
                    console.log('VeChain wallet detected');
                } else {
                    console.log('No VeChain wallet found');
                }
            }
            setLoading(false);
        };

        // Check immediately if window is available
        if (typeof window !== 'undefined') {
            checkWallet();
        } else {
            // If SSR, just set loading to false
            setLoading(false);
        }

        // Also check after a short delay in case wallet loads async
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined') {
                checkWallet();
            }
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);

    const connectWallet = async () => {
        if (!window.connex) {
            alert('VeChain wallet not found. Please install VeWorld or Sync2.');
            return;
        }
        
        setConnex(window.connex);
        
        try {
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: { type: 'text', content: 'Connect to ARKV DAO - Proof of Creation Platform' }
            };
            const cert = await window.connex.vendor.sign('cert').request(message);
            if (cert && cert.annex && cert.annex.signer) {
                setAccount(cert.annex.signer);
                console.log('Wallet connected:', cert.annex.signer);
            }
        } catch (error: any) {
            console.error("Failed to connect wallet:", error);
            if (error.message?.includes('user denied')) {
                alert('Connection rejected by user');
            } else {
                alert('Failed to connect wallet. Please try again.');
            }
        }
    };

    const disconnectWallet = () => { setAccount(null); };

    return (
        <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, loading, connex }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
