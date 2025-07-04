"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

const BusinessPage = () => {
    const [formData, setFormData] = useState({
        entityName: '',
        domain: '',
        country: '',
        legalType: '',
        category: ''
    });
    const [shaHash, setShaHash] = useState('');
    const [dnsVerified, setDnsVerified] = useState<boolean | null>(null);
    const [txHash, setTxHash] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [status, setStatus] = useState('');

    // Connect VeChain Walletllet
    const connectWallet = async () => {
        try {
            const provider = window.vechain || window.sync2;
            if (!provider) {
                setStatus("No VeChain wallet found! Please install Sync2 or VeWorld.");
                return;
            }
            
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];
            setWalletAddress(address);
            setStatus("Wallet connected successfully!");
        } catch (err) {
            setStatus("User denied wallet connection.");
        }
    };

    // Generate SHA-256 Hash
    const generateSHA256 = async (data: BusinessFormData) => {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(data));
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Check DNS TXT Record
    const checkDNS = async (domain: string, shaId: string) => {
        try {
            // Simulated DNS check - in production, use Google DNS API or Cloudflare API
            const response = await fetch(`https://dns.google/resolve?name=_arkv.${domain}&type=TXT`);
            const data = await response.json();
            
            if (data.Answer) {
                const txtRecord = data.Answer.find((record: { data: string }) => 
                    record.data.includes(`SHA-ID:${shaId}`)
                );
                return !!txtRecord;
            }
            return false;
        } catch (error) {
            console.error('DNS check failed:', error);
            return false;
        }
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("Generating SHA-256 hash...");
        
        // Generate SHA-256
        const hash = await generateSHA256(formData);
        setShaHash(hash);
        
        // Check DNS
        setStatus("Checking DNS TXT record...");
        const dnsResult = await checkDNS(formData.domain, hash);
        setDnsVerified(dnsResult);
        
        // Simulate Connex TX (in production, implement actual blockchain transaction)
        if (walletAddress) {
            setStatus("Sending transaction...");
            try {
                const provider = window.vechain || window.sync2;
                const txParams = {
                    to: "0x0000000000000000000000000000000000000000", // Contract address
                    value: "0x0",
                    data: `0x${hash}` // Store hash on blockchain
                };
                
                const txResult = await provider.request({
                    method: 'eth_sendTransaction',
                    params: [txParams]
                });
                
                setTxHash(txResult);
                setStatus("Registration completed successfully!");
            } catch (error: any) {
                setStatus("Transaction failed: " + error.message);
            }
        } else {
            setStatus("Please connect wallet first");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Business Registration</h1>
                    <p className="text-blue-200">Register your entity with SHA-256 proof and DNS verification</p>
                </div>

                {/* Wallet Connection */}
                <Script src="https://unpkg.com/@vechain/connex@3" strategy="beforeInteractive" />
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    {!walletAddress ? (
                        <button 
                            onClick={connectWallet}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Connect VeChain Wallet
                        </button>
                    ) : (
                        <div className="text-green-300">
                            ✅ Wallet Connected: {walletAddress.substring(0,6)}...{walletAddress.substring(38)}
                        </div>
                    )}
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Entity Name</label>
                            <input
                                type="text"
                                value={formData.entityName}
                                onChange={(e) => setFormData({...formData, entityName: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-300"
                                placeholder="Your Company Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Domain</label>
                            <input
                                type="text"
                                value={formData.domain}
                                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-300"
                                placeholder="example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Country</label>
                            <select
                                value={formData.country}
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="CA">Canada</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Legal Type</label>
                            <select
                                value={formData.legalType}
                                onChange={(e) => setFormData({...formData, legalType: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="LLC">LLC</option>
                                <option value="Corporation">Corporation</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Retail">Retail</option>
                            <option value="Manufacturing">Manufacturing</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                        disabled={!walletAddress}
                    >
                        Generate SHA-256 & Register
                    </button>
                </form>

                {/* Results */}
                {status && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-blue-200">{status}</p>
                    </div>
                )}

                {shaHash && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Registration Results</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">SHA-ID:</label>
                                <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{shaHash}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300">DNS Verified:</label>
                                <p className={`font-semibold ${dnsVerified ? 'text-green-400' : 'text-red-400'}`}>
                                    {dnsVerified ? '✅ Verified' : '❌ Not Verified'}
                                </p>
                            </div>
                            
                            {txHash && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">TX Hash:</label>
                                    <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{txHash}</p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Final Status:</label>
                                <p className={`font-semibold ${dnsVerified && txHash ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {dnsVerified && txHash ? '✅ Complete' : '⏳ Pending'}
                                </p>
                            </div>
                        </div>

                        {formData.domain && (
                            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
                                <p className="text-sm text-yellow-200">
                                    <strong>DNS Setup Required:</strong> Add TXT record to your domain:
                                </p>
                                <p className="font-mono text-xs mt-1">
                                    _arkv.{formData.domain} → SHA-ID:{shaHash}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessPage;

