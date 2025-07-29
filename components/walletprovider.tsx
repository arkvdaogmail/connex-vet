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
        // Simple and fast wallet check
        setLoading(false); // Stop loading immediately
        
        if (typeof window !== 'undefined' && window.connex) {
            setConnex(window.connex);
        }
    }, []);

    const connectWallet = async () => {
        try {
            if (!window.connex) {
                alert('Install VeWorld wallet');
                return;
            }
            
            setConnex(window.connex);
            
            const cert = await window.connex.vendor.sign('cert').request({
                purpose: 'identification',
                payload: { type: 'text', content: 'Connect to ARKV' }
            });
            
            if (cert?.annex?.signer) {
                setAccount(cert.annex.signer);
            }
        } catch (error: any) {
            console.log('Connection cancelled');
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
