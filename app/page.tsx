"use client";

import Link from "next/link";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
            <div className="text-center mb-12">
                <h1 className="text-6xl font-bold mb-4">ARKV DAO</h1>
                <p className="text-xl text-blue-200 mb-8">
                    Decentralized Proof of Creation & Verification
                </p>
            </div>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
                <Link href="/business" className="group">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="text-4xl mb-4">🏢</div>
                        <h3 className="text-xl font-semibold mb-2">Business Registration</h3>
                        <p className="text-blue-200">Register your entity with SHA-256 proof and DNS verification</p>
                    </div>
                </Link>

                <Link href="/proof" className="group">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="text-4xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold mb-2">Proof Upload</h3>
                        <p className="text-blue-200">Upload proof-of-creation files to IPFS with metadata</p>
                    </div>
                </Link>

                <Link href="/verify" className="group">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-xl font-semibold mb-2">Verification</h3>
                        <p className="text-blue-200">Search and verify proof records by SHA-ID or domain</p>
                    </div>
                </Link>
            </div>

            {/* Features */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full">DNS TXT Verification</span>
                    <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full">SHA-256 Generation</span>
                    <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full">IPFS Storage</span>
                    <span className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full">Connex TX Signing</span>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

