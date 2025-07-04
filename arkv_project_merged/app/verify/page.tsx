"use client";

import { useState } from "react";
import Link from "next/link";

const VerifyPage = () => {
    const [searchType, setSearchType] = useState('sha-id');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof mockDatabase | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock database of proof records
    const mockDatabase = [
        {
            shaId: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
            entityName: 'TechCorp LLC',
            domain: 'techcorp.com',
            txHash: '0x1234567890abcdef1234567890abcdef12345678',
            timestamp: '2024-06-18T10:30:00Z',
            dnsVerified: true,
            cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
            fileType: 'application/pdf',
            creator: 'John Doe'
        },
        {
            shaId: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
            entityName: 'InnovateX Corp',
            domain: 'innovatex.io',
            txHash: '0x2345678901bcdef1234567890abcdef123456789',
            timestamp: '2024-06-17T15:45:00Z',
            dnsVerified: false,
            cid: 'QmZwBPKzv6DZsnB726t4Yg3qpIdXEz80pjXnQcdE',
            fileType: 'image/png',
            creator: 'Jane Smith'
        }
    ];

    // Search function
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        let results: typeof mockDatabase = [];
        
        switch (searchType) {
            case 'sha-id':
                results = mockDatabase.filter(record => 
                    record.shaId.toLowerCase().includes(searchQuery.toLowerCase())
                );
                break;
            case 'domain':
                results = mockDatabase.filter(record => 
                    record.domain.toLowerCase().includes(searchQuery.toLowerCase())
                );
                break;
            case 'entity':
                results = mockDatabase.filter(record => 
                    record.entityName.toLowerCase().includes(searchQuery.toLowerCase())
                );
                break;
        }

        setSearchResults(results);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="text-blue-300 hover:text-white">← Back to Home</Link>
                    <h1 className="text-4xl font-bold mt-4 mb-2">Verification</h1>
                    <p className="text-blue-200">Search and verify proof records by SHA-ID, domain, or entity name</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Search Type</label>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                            >
                                <option value="sha-id">SHA-ID</option>
                                <option value="domain">Domain</option>
                                <option value="entity">Entity Name</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Search Query</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-300"
                                    placeholder={
                                        searchType === 'sha-id' ? 'Enter SHA-256 hash...' :
                                        searchType === 'domain' ? 'Enter domain name...' :
                                        'Enter entity name...'
                                    }
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded font-semibold transition-colors"
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Search Results */}
                {searchResults !== null && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Search Results ({searchResults.length} found)
                        </h3>

                        {searchResults.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-300">No records found for your search query.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {searchResults.map((record, index) => (
                                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-lg mb-2">{record.entityName}</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-300">Domain:</span>
                                                        <span className="ml-2">{record.domain}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-300">SHA-ID:</span>
                                                        <p className="font-mono text-xs bg-gray-800 p-1 rounded mt-1 break-all">
                                                            {record.shaId}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-300">TX Hash:</span>
                                                        <p className="font-mono text-xs bg-gray-800 p-1 rounded mt-1 break-all">
                                                            {record.txHash}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-300">Timestamp:</span>
                                                        <span className="ml-2">
                                                            {new Date(record.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-300">DNS Verified:</span>
                                                        <span className={`ml-2 font-semibold ${
                                                            record.dnsVerified ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                            {record.dnsVerified ? '✅ Verified' : '❌ Not Verified'}
                                                        </span>
                                                    </div>
                                                    {record.cid && (
                                                        <div>
                                                            <span className="text-gray-300">IPFS CID:</span>
                                                            <p className="font-mono text-xs bg-gray-800 p-1 rounded mt-1 break-all">
                                                                {record.cid}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {record.fileType && (
                                                        <div>
                                                            <span className="text-gray-300">File Type:</span>
                                                            <span className="ml-2">{record.fileType}</span>
                                                        </div>
                                                    )}
                                                    {record.creator && (
                                                        <div>
                                                            <span className="text-gray-300">Creator:</span>
                                                            <span className="ml-2">{record.creator}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Verification Status */}
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-300">Verification Status:</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    record.dnsVerified && record.txHash ? 
                                                    'bg-green-500/20 text-green-300' : 
                                                    'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                    {record.dnsVerified && record.txHash ? 'Fully Verified' : 'Partial Verification'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Demo Data Notice */}
                <div className="mt-6 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-200">
                        <strong>Demo Mode:</strong> This is showing mock data for demonstration. 
                        Try searching for "techcorp", "innovatex", or partial SHA-IDs like "a1b2c3".
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;

