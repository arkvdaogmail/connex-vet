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
        if (window.connex) {
            try {
                const connexInstance = new window.connex.Connex({
                    node: 'https://testnet.vecha.in/',
                    network: 'test'
                } );
                setConnex(connexInstance);
            } catch (e) {
                console.error("Failed to initialize Connex", e);
            }
        }
        setLoading(false);
    }, []);

    const connectWallet = async () => {
        if (!connex) {
            alert('VeWorld wallet not found.');
            return;
        }
        try {
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: { type: 'text', content: 'Sign a certificate to prove your identity.' }
            };
            const cert = await connex.vendor.sign('cert').request(message);
            if (cert) {
                setAccount(cert.annex.signer);
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
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
