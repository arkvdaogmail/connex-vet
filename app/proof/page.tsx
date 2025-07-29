"use client";
import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/walletprovider";

const ProofPage = () => {
    const { account, connex } = useWallet();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');
    const [txid, setTxid] = useState('');
    const [docHash, setDocHash] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setStatus('Error: File size must be less than 10MB.');
                return;
            }
            setFile(selectedFile);
            setStatus(`File selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`);
        } else {
            setFile(null);
            setStatus('');
        }
        setTxid('');
        setDocHash('');
    };

    const calculateFileHash = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target?.result as ArrayBuffer;
                    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    resolve('0x' + hashHex);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
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
        if (!connex) {
            setStatus('Error: VeChain wallet not properly connected.');
            return;
        }

        setProcessing(true);
        setStatus('Calculating document hash...');

        try {
            // Step 1: Calculate file hash
            setStatus('📊 Calculating file hash...');
            const hash = await calculateFileHash(file);
            setDocHash(hash);
            console.log('✅ Hash calculated:', hash);

            // Step 2: Prepare VeChain transaction
            setStatus('💰 Preparing payment transaction (1 VET)...');
            
            const clause = {
                to: '0x0000000000000000000000000000000000000000',
                value: '1000000000000000000', // 1 VET
                data: hash
            };

            console.log('📝 Transaction clause:', clause);

            // Step 3: Send transaction
            setStatus('🔐 Please approve transaction in your wallet...');
            
            const signingService = connex.vendor.sign('tx');
            signingService.comment(`ARKV: ${file.name}`);
            const result = await signingService.request([clause]);
            
            console.log('📤 Transaction result:', result);
            
            if (result && result.txid) {
                setTxid(result.txid);
                
                // Step 4: Store for lookup
                const proofRecord = {
                    shaId: hash.substring(2),
                    txHash: result.txid,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    timestamp: new Date().toISOString(),
                    creator: account,
                    fee: '1 VET'
                };
                
                const existingRecords = JSON.parse(localStorage.getItem('arkv_proof_records') || '[]');
                existingRecords.push(proofRecord);
                localStorage.setItem('arkv_proof_records', JSON.stringify(existingRecords));
                
                setStatus('✅ SUCCESS! Hash recorded on VeChain. Payment: 1 VET');
                console.log('✅ Proof record saved:', proofRecord);
            } else {
                throw new Error('No transaction ID returned');
            }

        } catch (error: any) {
            console.error('Transaction error:', error);
            if (error.message.includes('user denied')) {
                setStatus('Error: Transaction was rejected by user.');
            } else if (error.message.includes('insufficient')) {
                setStatus('Error: Insufficient VET balance. You need at least 1 VET plus gas fees.');
            } else {
                setStatus(`Error: ${error.message || 'Transaction failed'}`);
            }
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
                    <p className="text-blue-200">Upload a file to record its hash on VeChain TestNet (Fee: 1 VET)</p>
                </div>

                {/* File Upload Form - Always Visible */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select File</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                            required 
                            accept="*/*"
                        />
                        <p className="text-sm text-gray-400 mt-1">Maximum file size: 10MB</p>
                    </div>
                    
                    {file && (
                        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                            <p className="text-sm text-blue-200">
                                <strong>File:</strong> {file.name}<br/>
                                <strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB<br/>
                                <strong>Type:</strong> {file.type || 'Unknown'}
                            </p>
                        </div>
                    )}

                    {/* Payment Section - Only show when file is selected */}
                    {file && (
                        <div>
                            {!account ? (
                                <div className="mb-4">
                                    <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
                                        <p className="text-sm text-yellow-200">
                                            <strong>⚡ Transaction Fee:</strong> 1 VET + network gas fees<br/>
                                            <strong>💾 Storage:</strong> Document hash will be permanently recorded on VeChain TestNet
                                        </p>
                                    </div>
                                    <button 
                                        onClick={connectWallet}
                                        className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        Connect Wallet to Pay & Generate Hash
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
                                        <p className="text-sm text-yellow-200">
                                            <strong>⚡ Transaction Fee:</strong> 1 VET + network gas fees<br/>
                                            <strong>💾 Storage:</strong> Document hash will be permanently recorded on VeChain TestNet
                                        </p>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={processing || !file} 
                                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        {processing ? 'Processing...' : 'Pay 1 VET & Generate Hash'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {status && (
                    <div className={`border rounded-lg p-4 mb-4 ${
                        status.includes('Error') || status.includes('failed') 
                            ? 'bg-red-500/20 border-red-500/30 text-red-200' 
                            : status.includes('Success') || status.includes('✅')
                            ? 'bg-green-500/20 border-green-500/30 text-green-200'
                            : 'bg-blue-500/20 border-blue-500/30 text-blue-200'
                    }`}>
                        <p>{status}</p>
                    </div>
                )}

                {txid && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">📋 Transaction Details</h3>
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
                                <label className="block text-sm font-medium text-gray-300">Document Hash (SHA-256):</label>
                                <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{docHash}</p>
                            </div>
                            {file && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Original Filename:</label>
                                    <p className="text-sm bg-gray-800 p-2 rounded">{file.name}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Fee Paid:</label>
                                <p className="text-sm bg-gray-800 p-2 rounded">1 VET + gas fees</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofPage;

