"use client";
import { useWallet } from '@vechain/dapp-kit-react';

const ProofPage = () => {
    const { account, connect, disconnect } = useWallet();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-center mb-8">VeChain Upload & Pay</h1>
                
                {!account ? (
                    <div className="text-center">
                        <p className="mb-4">Connect your VeChain wallet</p>
                        <button 
                            onClick={connect}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                        >
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="mb-4 text-green-400">✅ Connected: {account.slice(0,6)}...{account.slice(-4)}</p>
                        <div className="space-y-4">
                            <input 
                                type="file" 
                                className="w-full p-3 rounded bg-white/10 border border-white/20 text-white"
                                placeholder="Upload file to pay gas & generate hash"
                            />
                            <button 
                                onClick={disconnect}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofPage;

