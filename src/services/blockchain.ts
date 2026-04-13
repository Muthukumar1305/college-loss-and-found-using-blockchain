import { ethers } from 'ethers';

// Contract ABI (Simplified for the example)
const CONTRACT_ABI = [
  "function registerItem(string memory _itemHash) public returns (uint256)",
  "function updateStatus(uint256 _id, uint8 _status) public",
  "function getItem(uint256 _id) public view returns (uint256, string memory, uint8, address)",
  "event ItemRegistered(uint256 id, string itemHash, address recorder)",
  "event StatusUpdated(uint256 id, uint8 status)"
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const blockchainService = {
  getProvider: () => {
    // Connect to local Ganache or MetaMask
    if (window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    // Fallback to local RPC (Hardhat default)
    return new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  },

  registerItemOnChain: async (itemHash: string) => {
    try {
      const provider = blockchainService.getProvider();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerItem(itemHash);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error("Blockchain registration failed:", error);
      throw error;
    }
  },

  updateItemStatusOnChain: async (itemId: number, status: number) => {
    try {
      const provider = blockchainService.getProvider();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.updateStatus(itemId, status);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error("Blockchain status update failed:", error);
      throw error;
    }
  }
};