"use client";
import { useState } from "react";
import Link from "next/link";

const ProofPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [hash, setHash] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setLoading(true);
            
            try {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                setHash(calculatedHash);
            } catch (error) {
                console.error('Hash calculation failed:', error);
            }
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 pt-20">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Simple Upload Test</h1>
                    <p className="text-blue-200">Just upload file and see hash - no blockchain, no payment</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select File</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                        />
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

                    {loading && (
                        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
                            <p className="text-yellow-200">🔄 Calculating hash...</p>
                        </div>
                    )}

                    {hash && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">✅ Hash Generated</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">SHA-256 Hash:</label>
                                    <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{hash}</p>
                                </div>
                                {file && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">File Name:</label>
                                        <p className="text-sm bg-gray-800 p-2 rounded">{file.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProofPage;

