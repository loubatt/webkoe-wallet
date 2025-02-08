const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Anda perlu menginstal ini: npm install axios
const path = require('path');
const bech32 = require('bech32-buffer');
const CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs');

// Ganti dengan API Key Blockfrost Anda
const BLOCKFROST_API_KEY = 'mainnetRNHSC1aMMsrTstlM1pm6lCz0WAv9zeY3';
const BLOCKFROST_API_URL = 'https://cardano-mainnet.blockfrost.io/api/v0'; // Ganti dengan testnet jika membutuhkan

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post('/getAddressInfo', async (req, res) => {
  const { address } = req.body;

  const addrHash = CardanoWasm.Address.from_bytes(Buffer.from(address, 'hex'));
  const bech32Addr = addrHash.to_bech32();

  console.log('Received address:', bech32Addr);
  
  async function getAddressInfo(address) {
    try {
      const response = await fetch(`${BLOCKFROST_API_URL}/addresses/${address}`, {
        headers: {
          'project_id': BLOCKFROST_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Address Info:', JSON.stringify(data));
      return res.json({message: 'Address info retrieved successfully: ' + JSON.stringify(data) });
    } catch (error) {
      console.error('Error fetching address info:', error);
    }
  }
  
  // Misalkan 'address' adalah alamat bech32 yang Anda dapatkan dari wallet
  const _address = bech32Addr; // Ganti dengan alamat bech32 Anda
  getAddressInfo(_address);

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});