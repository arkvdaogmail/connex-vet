"use client";
import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/walletprovider";

const ProofPage = () => {
    const { account, connectWallet, connex } = useWallet();
    const [file, setFile] = useState<File | null>(null);
    const [hash, setHash] = useState('');
    const [txId, setTxId] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('upload'); // 'upload', 'pay', 'complete'

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStep('pay');
        }
    };

    const payGasAndGenerateHash = async () => {
        if (!file || !connex) return;
        
        setLoading(true);
        try {
            // Step 1: Calculate hash
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Step 2: Pay VTHO gas to store hash on VeChain
            const clause = {
                to: '0x0000000000000000000000000000000000000000',
                value: '0x0',
                data: '0x' + calculatedHash
            };

            const result = await connex.vendor.sign('tx', [clause]).request();
            
            if (result) {
                setHash(calculatedHash);
                setTxId(result.txid);
                setStep('complete');
            }
        } catch (error) {
            console.error('Payment/hash failed:', error);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 pt-20">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Upload → Pay Gas → Generate Hash</h1>
                    <p className="text-blue-200">3-step process: Upload file, pay VTHO gas, get hash</p>
                </div>

                {/* Step 1: Upload File */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {step === 'upload' ? '📁 Step 1: Upload File' : '✅ Step 1: File Uploaded'}
                    </h3>
                    
                    {step === 'upload' ? (
                        <div>
                            <label className="block text-sm font-medium mb-2">Select File</label>
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                            />
                        </div>
                    ) : (
                        <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                            <p className="text-sm text-blue-200">
                                <strong>File:</strong> {file?.name}<br/>
                                <strong>Size:</strong> {file ? (file.size / 1024).toFixed(1) : 0} KB
                            </p>
                        </div>
                    )}
                </div>

                {/* Step 2: Pay Gas */}
                {step === 'pay' && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">💰 Step 2: Pay VTHO Gas</h3>
                        
                        {!account ? (
                            <div>
                                <p className="text-yellow-200 mb-4">Connect your VeChain wallet to pay gas and generate hash</p>
                                <button 
                                    onClick={connectWallet}
                                    className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                                >
                                    🔗 Connect VeChain Wallet
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-green-200 mb-4">✅ Wallet connected: {account.slice(0,6)}...{account.slice(-4)}</p>
                                <button 
                                    onClick={payGasAndGenerateHash}
                                    disabled={loading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold"
                                >
                                    {loading ? '⏳ Paying VTHO gas...' : '💳 Pay VTHO Gas & Generate Hash'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Hash Result */}
                {step === 'complete' && hash && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">✅ Step 3: Hash Generated!</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">SHA-256 Hash:</label>
                                <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{hash}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Transaction ID:</label>
                                <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{txId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">VTHO Gas:</label>
                                <p className="text-sm bg-gray-800 p-2 rounded">✅ Paid successfully</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofPage;

