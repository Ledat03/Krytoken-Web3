import { ethers, JsonRpcSigner } from "ethers";
import { Web3Service } from "./Web3Service";
import KYS_ABI from "../../contracts/Token/KYS.sol/KYS.json";
export const IERC20_ABI = KYS_ABI.abi;
export class ContractService extends Web3Service {
  contractAddress = import.meta.env.VITE_KYS_CONTRACT_ADDRESS;
  constructor() {
    super();
  }
  async getContract(): Promise<ethers.Contract | null> {
    if (!this.provider || !this.signer) {
      this.initCreate();
    }

    if (!window.ethereum) {
      console.log("Wallet not connected");
      this.initCreate();
    }

    return new ethers.Contract(this.contractAddress, IERC20_ABI, this.signer);
  }

  async getTokenBalance(userAddress: string): Promise<string> {
    try {
      const contract = await this.getContract();
      if (!contract) throw new Error("Contract not found");
      const balance = await contract.balanceOf(userAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting token balance:", error);
      return "0";
    }
  }

  async transferToken(to: string, amount: string): Promise<boolean> {
    try {
      const contract = await this.getContract();
      if (!contract) throw new Error("Contract not found");

      const amountWei = ethers.parseEther(amount);
      const tx = await contract.transfer(to, amountWei);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error transferring token:", error);
      return false;
    }
  }

  async approveToken(spender: string, amount: string): Promise<boolean> {
    try {
      const contract = await this.getContract();
      if (!contract) throw new Error("Contract not found");

      const amountWei = ethers.parseEther(amount);
      console.log(this.signer);
      const tx = await contract.approve(spender, amountWei);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error approving token:", error);
      return false;
    }
  }

  async getCurrentAccount(): Promise<string | null> {
    try {
      if (!this.signer) return null;
      return await this.signer.getAddress();
    } catch (error) {
      console.error("Error getting current account:", error);
      return null;
    }
  }

  getNetworkInfo = async () => {
    try {
      if (!this.provider) {
        this.getContract();
      }
      const network = await this.provider?.getNetwork();
      return {
        chainId: Number(network?.chainId),
        name: network?.name,
      };
    } catch (error) {
      console.error("Error getting network info:", error);
      return null;
    }
  };
  signMessage = async (nonce: string, address: JsonRpcSigner) => {
    if (address) {
      const signature = await address.signMessage(nonce);
      return signature;
    }
  };
}

export const contractService = new ContractService();
