"use client";
import { useWallet } from './WalletProvider';

const Header = () => {
    const { account, connectWallet, disconnectWallet, loading } = useWallet();
    const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

    return (
        <header className="absolute top-0 right-0 p-4 z-10">
            {loading ? (
                <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded" disabled>Loading...</button>
            ) : account ? (
                <div className="flex items-center space-x-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{formatAddress(account)}</span>
                    <button onClick={disconnectWallet} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Disconnect</button>
                </div>
            ) : (
                <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect Wallet</button>
            )}
        </header>
    );
};

export default Header;
