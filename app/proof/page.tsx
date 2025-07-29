"use client";
import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";

const ProofPage = () => {
    const { account, connex } = useWallet();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');
    const [txid, setTxid] = useState('');
    const [docHash, setDocHash] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
        setStatus('');
        setTxid('');
        setDocHash('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!account) {
            setStatus('Error: Please connect your wallet first.');
            return;
        }
        if (!file) {
            setStatus('Error: Please select a file.');
            return;
        }

        setProcessing(true);
        setStatus('Calculating document hash...');

        try {
            const fileBuffer = await file.arrayBuffer();
            const hash = '0x' + Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', fileBuffer))).map(b => b.toString(16).padStart(2, '0')).join('');
            setDocHash(hash);

            setStatus('Please check your wallet to approve the transaction...');

            const signingService = connex.vendor.sign('tx');
            signingService.comment('Notarize document hash on TestNet');
            
            const result = await signingService.request([{ to: null, value: '0x0', data: hash }]);
            setTxid(result.txid);
            setStatus('✅ Success! Your document hash has been recorded on the VeChain TestNet.');

        } catch (error: any) {
            setStatus(`Error: The transaction failed. Message: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 pt-20">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Proof Upload</h1>
                    <p className="text-blue-200">Upload a file to record its hash on the VeChain TestNet.</p>
                </div>

                {!account ? (
                     <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
                        <p className="text-red-200">Please connect your wallet using the button in the top-right corner to continue.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Select File</label>
                            <input type="file" onChange={handleFileChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white" required />
                        </div>
                        <button type="submit" disabled={processing || !file} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                            {processing ? 'Processing...' : 'Notarize on VeChain'}
                        </button>
                    </form>
                )}

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
                                <a href={`https://explore-testnet.vechain.org/transactions/${txid}`} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-green-400 bg-gray-800 p-2 rounded break-all block hover:underline">{txid}</a>
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

