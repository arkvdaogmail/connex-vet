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
        try {
            if (!window.connex) {
                alert('VeChain wallet not found. Please install VeWorld.');
                return;
            }
            
            setConnex(window.connex);
            
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: { type: 'text', content: 'Connect to ARKV DAO' }
            };
            
            const cert = await window.connex.vendor.sign('cert').request(message);
            
            if (cert && cert.annex && cert.annex.signer) {
                setAccount(cert.annex.signer);
                console.log('✅ Wallet connected:', cert.annex.signer);
            } else {
                throw new Error('No signer address returned');
            }
        } catch (error: any) {
            console.error("❌ Wallet connection failed:", error);
            alert('Failed to connect wallet: ' + error.message);
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
