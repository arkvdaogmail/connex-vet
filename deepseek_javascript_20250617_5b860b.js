document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const connectBtn = document.getElementById('connectWallet');
    const sendBtn = document.getElementById('sendTransaction');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const statusDiv = document.getElementById('status');
    const txTypeSelect = document.getElementById('txType');
    const contractSection = document.getElementById('contractSection');
    
    // Detect wallet provider (Sync2 or VeWorld)
    const getProvider = () => {
        if (typeof window.vechain !== 'undefined') {
            return window.vechain;
        }
        if (typeof window.sync2 !== 'undefined') {
            return window.sync2;
        }
        throw new Error('No Vechain wallet detected! Install Sync2 or VeWorld');
    };
    
    // Connect Wallet
    connectBtn.addEventListener('click', async () => {
        try {
            const provider = getProvider();
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length > 0) {
                const address = accounts[0];
                walletAddress.textContent = `${address.substring(0,6)}...${address.substring(38)}`;
                walletInfo.style.display = 'flex';
                connectBtn.textContent = 'Wallet Connected';
                connectBtn.disabled = true;
                
                // Check network
                const chainId = await provider.request({ method: 'eth_chainId' });
                const isTestnet = chainId === '0x27';
                
                if (!isTestnet) {
                    showStatus('⚠️ Switch wallet to TESTNET before sending transactions', 'error');
                }
            }
        } catch (error) {
            showStatus(`Connection failed: ${error.message}`, 'error');
        }
    });
    
    // Toggle contract fields
    txTypeSelect.addEventListener('change', () => {
        contractSection.style.display = 
            txTypeSelect.value === 'contract' ? 'block' : 'none';
    });
    
    // Send Transaction
    sendBtn.addEventListener('click', async () => {
        try {
            const provider = getProvider();
            const recipient = document.getElementById('recipient').value;
            const amount = document.getElementById('amount').value;
            
            if (!recipient || !amount) {
                showStatus('Please fill all fields', 'error');
                return;
            }
            
            showStatus('Building transaction...', 'loading');
            
            // Convert VET to wei (1 VET = 10^18 wei)
            const value = BigInt(Math.floor(amount * 1e18)).toString();
            
            let txParams;
            if (txTypeSelect.value === 'vet') {
                // VET transfer
                txParams = {
                    to: recipient,
                    value: '0x' + BigInt(value).toString(16),
                    data: '0x'
                };
            } else {
                // Contract interaction
                const contractAddr = document.getElementById('contractAddress').value;
                const funcData = document.getElementById('functionData').value;
                
                if (!contractAddr || !funcData) {
                    showStatus('Contract fields required', 'error');
                    return;
                }
                
                txParams = {
                    to: contractAddr,
                    value: '0x0',
                    data: funcData.startsWith('0x') ? funcData : `0x${funcData}`
                };
            }
            
            showStatus('Confirm in wallet...', 'loading');
            
            // Send transaction
            const txHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [txParams]
            });
            
            showStatus(`Transaction sent! Hash: ${txHash}`, 'success');
            showStatus(`Tracking: https://explore-testnet.vechain.org/transactions/${txHash}`);
            
        } catch (error) {
            showStatus(`Transaction failed: ${error.message}`, 'error');
        }
    });
    
    // Status display helper
    function showStatus(message, type = '') {
        statusDiv.style.display = 'block';
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
    }
});