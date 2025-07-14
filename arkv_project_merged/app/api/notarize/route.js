Console.log('--- The notarize.js file was called! ---'); // Your test line is in the right place.

import { Driver, SimpleWallet } from 'thor-devkit';

export default async function handler(req, res) {
  // This handles the OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- 1. Basic Setup & Input Validation ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { hash } = req.body;
  if (!hash) {
    return res.status(400).json({ error: 'Hash is required' });
  }
  
  // --- 2. Get Private Key (Temporary Hardcoded Method) ---
  // WARNING: For testing only. Remove before deploying.
  const privateKey = "volcano cliff mercy buddy poem illegal jazz umbrella simple arrow egg october"; 
  
  if (!privateKey || privateKey === " ") {
    console.error('Private key is not set correctly in the code.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // --- 3. Connect to the VeChain TESTNET ---
    const wallet = new SimpleWallet();
    wallet.import(privateKey);
    
    const nodeUrl = 'https://testnet.veblocks.net';
    const driver = await Driver.connect({ node: nodeUrl, wallet });

    // --- 4. Build the Transaction Clause ---
    const clause = {
      to: wallet.address,
      value: 0,
      data: hash
    };

    // --- 5. Send the Transaction ---
    const { txid } = await driver.sendClauses([clause], {
        comment: 'My Testnet Notarization'
    });
    
    console.log(`Transaction successfully submitted: ${txid}`);

    // --- 6. Return the Success Response ---
    return res.status(200).json({ txid: txid });

  } catch (error) {
    console.error('Notarization error:', error);
    return res.status(500).json({ 
      error: 'Failed to notarize document',
      details: error.message 
    });
  }
}
