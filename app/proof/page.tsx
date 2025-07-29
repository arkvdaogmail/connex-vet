"use client";

import { useState } from "react";
import Link from "next/link";

// This makes the 'connex' object available from the VeWorld wallet
declare global {
    interface Window {
        connex: any;
    }
}

const ProofPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');
    const [txid, setTxid] = useState('');
    const [docHash, setDocHash] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile || null);
        // Clear previous results when a new file is selected
        setStatus('');
        setTxid('');
        setDocHash('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setStatus('Error: Please select a file first.');
            return;
        }

        // Check if the VeWorld wallet is available
        if (!window.connex) {
            setStatus('Error: VeChain wallet not found. Please install and unlock VeWorld.');
            return;
        }

        setProcessing(true);
        setStatus('Calculating document hash...');

        try {
            // 1. Create the unique hash of the document
            const fileBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
            const hash = '0x' + Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            setDocHash(hash);

            setStatus('Please check your wallet to approve the transaction...');

            // 2. Connect to the wallet and request a transaction signature
            const signingService = window.connex.vendor.sign('tx');
            signingService.comment('Notarize document hash on TestNet');
            
            const { txid } = await signingService.request([{
                to: null, // This creates a contract clause, not a VET transfer
                value: '0x0',
                data: hash
            }]);

            // 3. Success! Show the real Transaction ID (TXID)
            setTxid(txid);
            setStatus('✅ Success! Your document hash has been recorded on the VeChain TestNet.');

        } catch (error: any) {
            console.error(error);
            setStatus(`Error: The transaction failed. Message: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">VeChain Document Notarization</h1>
                    <p className="text-blue-200">Upload a file to permanently record its hash on the VeChain TestNet.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select File</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !file}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        {processing ? 'Processing...' : 'Notarize on VeChain'}
                    </button>
                </form>

                {status && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-blue-200">{status}</p>
                    </div>
                )}

                {txid && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Transaction ID (TXID):</label>
                                <a 
                                    href={`https://explore-testnet.vechain.org/transactions/${txid}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="font-mono text-sm text-green-400 bg-gray-800 p-2 rounded break-all block hover:underline"
                                >
                                    {txid}
                                </a>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Document Hash:</label>
                                <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{docHash}</p>
                            </div>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ProofPage;

