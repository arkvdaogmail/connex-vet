"use client";
import { useState } from "react";
import Link from "next/link";
import { useWallet, useConnex } from '@vechain/dapp-kit-react';

const ProofPage = () => {
    const { account } = useWallet();
    const { vendor } = useConnex();
    const [file, setFile] = useState<File | null>(null);
    const [hash, setHash] = useState('');
    const [txId, setTxId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUploadAndPay = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || !vendor || !account) return;
        
        setFile(selectedFile);
        setLoading(true);
        
        try {
            // Calculate hash
            const arrayBuffer = await selectedFile.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Pay gas and store hash
            const result = await vendor.sign('tx', [{
                to: '0x0000000000000000000000000000000000000000',
                value: '0x0',
                data: '0x' + calculatedHash
            }]).request();
            
            setHash(calculatedHash);
            setTxId(result.txid);
        } catch (error) {
            console.error('Upload failed:', error);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 pt-20">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">VeChain Document Upload</h1>
                    <p className="text-blue-200">Upload → Pay VTHO Gas → Store Hash on VeChain</p>
                </div>

                {!account ? (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold mb-4">Connect Wallet First</h3>
                        <p className="mb-4">Connect your VeChain wallet to upload and pay for hash storage</p>
                        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                            Connect VeChain Wallet
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                        <div className="mb-4 text-center">
                            <p className="text-green-300">✅ Wallet Connected: {account.slice(0,6)}...{account.slice(-4)}</p>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Upload File (Auto-Pay Gas)</label>
                            <input 
                                type="file" 
                                onChange={handleUploadAndPay}
                                disabled={loading}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50" 
                            />
                        </div>

                        {loading && (
                            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded text-center">
                                <p className="text-yellow-200">⏳ Uploading & Paying VTHO Gas...</p>
                            </div>
                        )}

                        {hash && txId && (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">✅ Success!</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">File Hash:</label>
                                        <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{hash}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Transaction ID:</label>
                                        <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{txId}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">VTHO Gas:</label>
                                        <p className="text-sm bg-gray-800 p-2 rounded">✅ Paid & Stored on VeChain</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofPage;

