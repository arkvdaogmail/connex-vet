"use client";
import { useState } from 'react';

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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-center mb-8">Simple File Upload & Hash</h1>
                
                <div className="text-center space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Upload File</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
                        />
                    </div>

                    {file && (
                        <div className="bg-white/10 p-4 rounded">
                            <p className="text-sm text-blue-200">
                                <strong>File:</strong> {file.name}<br/>
                                <strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-yellow-300">
                            🔄 Calculating hash...
                        </div>
                    )}

                    {hash && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded p-4">
                            <h3 className="text-lg font-semibold mb-2">✅ Hash Generated</h3>
                            <div className="text-left">
                                <label className="block text-sm font-medium text-gray-300">SHA-256:</label>
                                <p className="font-mono text-xs bg-gray-800 p-2 rounded break-all">{hash}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProofPage;

