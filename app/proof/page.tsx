"use client";

import { useState } from "react";
import Link from "next/link";

const ProofPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        creator: '',
        type: ''
    });
    const [shaId, setShaId] = useState('');
    const [ipfsCid, setIpfsCid] = useState('');
    const [status, setStatus] = useState('');
    const [uploading, setUploading] = useState(false);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile || null);
        if (selectedFile) {
            setMetadata({
                ...metadata,
                title: selectedFile.name,
                type: selectedFile.type
            });
        }
    };

    // Generate SHA-256 for file + metadata
    const generateFileSHA = async (file: File, metadata: { title: string; description: string; creator: string; type: string }) => {
        const fileBuffer = await file.arrayBuffer();
        const metadataString = JSON.stringify(metadata);
        const combined = new Uint8Array(fileBuffer.byteLength + metadataString.length);
        combined.set(new Uint8Array(fileBuffer), 0);
        combined.set(new TextEncoder().encode(metadataString), fileBuffer.byteLength);
        
        const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Simulate IPFS upload (in production, use Web3.Storage or similar)
    const uploadToIPFS = async (file: File, metadata: { title: string; description: string; creator: string; type: string }) => {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock CID
        const mockCid = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return mockCid;
    };

    // Submit proof
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setStatus('Please select a file');
            return;
        }

        setUploading(true);
        setStatus('Processing file...');

        try {
            // Generate SHA-ID
            setStatus('Generating SHA-256...');
            const hash = await generateFileSHA(file, metadata);
            setShaId(hash);

            // Upload to IPFS
            setStatus('Uploading to IPFS...');
            const cid = await uploadToIPFS(file, metadata);
            setIpfsCid(cid);

            // Save record (in production, save to database/blockchain)
            setStatus('Saving proof record...');
            const proofRecord = {
                shaId: hash,
                cid: cid,
                metadata: metadata,
                timestamp: new Date().toISOString(),
                fileSize: file.size,
                fileName: file.name
            };

            // Simulate saving
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setStatus('Proof uploaded successfully!');
        } catch (error: any) {
            setStatus('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Proof Upload</h1>
                    <p className="text-blue-200">Upload proof-of-creation files to IPFS with metadata</p>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    {/* File Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select File</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
                            accept="*/*"
                            required
                        />
                        {file && (
                            <p className="text-sm text-gray-300 mt-2">
                                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                value={metadata.title}
                                onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-300"
                                placeholder="Document title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Creator</label>
                            <input
                                type="text"
                                value={metadata.creator}
                                onChange={(e) => setMetadata({...metadata, creator: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-300"
                                placeholder="Creator name"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={metadata.description}
                            onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-300 h-24"
                            placeholder="Describe your proof of creation..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        {uploading ? 'Uploading...' : 'Upload Proof to IPFS'}
                    </button>
                </form>

                {/* Status */}
                {status && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-blue-200">{status}</p>
                    </div>
                )}

                {/* Results */}
                {shaId && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Proof Record</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">SHA-ID:</label>
                                <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{shaId}</p>
                            </div>
                            
                            {ipfsCid && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">IPFS CID:</label>
                                    <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{ipfsCid}</p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300">File Type:</label>
                                <p className="text-sm">{metadata.type}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Creator:</label>
                                <p className="text-sm">{metadata.creator}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Timestamp:</label>
                                <p className="text-sm">{new Date().toLocaleString()}</p>
                            </div>
                        </div>

                        {ipfsCid && (
                            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded">
                                <p className="text-sm text-green-200">
                                    ✅ Proof successfully uploaded to IPFS and recorded with SHA-ID
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofPage;

