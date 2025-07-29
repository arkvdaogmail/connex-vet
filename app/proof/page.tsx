"use client";
import { DAppKitProvider, WalletConnectModal } from '@vechain/dapp-kit-react';

const ProofPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-center mb-8">VeChain Upload & Pay</h1>
                <WalletConnectModal />
            </div>
        </div>
    );
};

export default ProofPage;

