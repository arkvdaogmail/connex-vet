"use client";
import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';

declare global {
    interface Window { connex: any; }
}

// Connex type definitions
declare namespace Connex {
    namespace Vendor {
        interface CertMessage {
            purpose: string;
            payload: {
                type: string;
                content: string;
            };
        }
    }
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
        console.log('WalletProvider useEffect triggered');
        console.log('window.connex:', window.connex);
        
        if (window.connex) {
            try {
                console.log('Initializing Connex...');
                const connexInstance = new window.connex.Connex({
                    node: 'https://testnet.vecha.in/',
                    network: 'test'
                });
                console.log('Connex instance created:', connexInstance);
                setConnex(connexInstance);
            } catch (e) {
                console.error("Failed to initialize Connex", e);
                const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                alert(`Failed to initialize VeChain connection: ${errorMessage}`);
            }
        } else {
            console.warn('window.connex not available. VeWorld wallet may not be installed.');
        }
        setLoading(false);
    }, []);

    const connectWallet = async () => {
        console.log('Attempting to connect wallet...');
        
        if (!connex) {
            console.error('Connex not available');
            alert('VeWorld wallet not found. Please install VeWorld wallet extension or use VeWorld mobile app.');
            return;
        }
        
        try {
            console.log('Connex available, requesting certificate...');
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: { type: 'text', content: 'Sign a certificate to prove your identity.' }
            };
            
            console.log('Requesting certificate with message:', message);
            const cert = await connex.vendor.sign('cert').request(message);
            
            if (cert) {
                console.log('Certificate received:', cert);
                setAccount(cert.annex.signer);
                console.log('Account set to:', cert.annex.signer);
            } else {
                console.error('No certificate received');
                alert('Failed to get certificate from wallet');
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to connect wallet: ${errorMessage}`);
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
