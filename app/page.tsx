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
<div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
<Link href="/business" className="group">
<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
<div className="text-4xl mb-4">🏢</div>
<h3 className="text-xl font-semibold mb-2">Business Registration</h3>
<p className="text-blue-200">Register your entity</p>
</div>
</Link>
<Link href="/proof" className="group">
<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
<div className="text-4xl mb-4">📄</div>
<h3 className="text-xl font-semibold mb-2">Proof Upload</h3>
<p className="text-blue-200">Upload a file</p>
</div>
</Link>
<Link href="/verify" className="group">
<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
<div className="text-4xl mb-4">✅</div>
<h3 className="text-xl font-semibold mb-2">Verification</h3>
<p className="text-blue-200">Verify a record</p>
</div>
</Link>
</div>
</div>
);
};
export default HomePage;
