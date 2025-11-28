import { ethers } from "ethers";
import ABI_marketplace from "../../contracts/marketplace/Marketplace.sol/Marketplace.json";
import { Web3Service } from "./Web3Service";
export const ABI_interact = ABI_marketplace.abi;
const marketAddress = import.meta.env.VITE_Marketplace_CONTRACT_ADDRESS;

class MarketplaceService extends Web3Service {
  constructor() {
    super();
  }

  async getMarketContract(): Promise<ethers.Contract | null> {
    if (!this.provider || !this.signer) {
      await this.initCreate();
    }
    return new ethers.Contract(marketAddress, ABI_interact, this.signer);
  }
  async readMarketContract(): Promise<ethers.Contract | null> {
    if (!this.provider || !this.signer) {
      await this.initCreate();
    }
    return new ethers.Contract(marketAddress, ABI_interact, this.provider);
  }
  async updateFeeRate(feeByDecimal: number, feeRate: number): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        console.log(this.signer, " ", this.provider);
        await contract.updateFeeRate(feeByDecimal, feeRate);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async updateFeeRecipient(fee: number): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract._updateFeeRecipient(fee);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async isSeller(orderId: number, seller: string): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        const response: Promise<boolean> = await contract.isSeller(orderId, seller);
        return response;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async addNewToken(tokenAddress: string): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.addNewToken(tokenAddress);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async isTokenSupported(tokenAddress: string): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        const response: Promise<boolean> = await contract.isTokenSupported(tokenAddress);
        return response;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async addOrder(tokenId: number, price: BigInt, tokenAddress: string): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.addOrder(tokenId, price, tokenAddress);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async cancelOffer(tokenId: number, index: number): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.cancelOffer(tokenId, index);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async acceptOffer(tokenId: number, index: number): Promise<boolean> {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.acceptOffer(tokenId, index);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async createOffer(price: BigInt, transferToken: string, tokenId: number) {
    try {
      console.log(this.signer)
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.createOffer(price, transferToken, tokenId);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async cancelOrder(orderId: number) {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.cancelOrder(orderId);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async executeOrder(orderId: number) {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        await contract.executeOrder(orderId);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async getSupportTokenList() {
    try {
      const contract = await this.getMarketContract();
      if (contract) {
        const res = await contract.getSupportTokenList();
        return res;
      }
    } catch (error) {
      throw error;
    }
  }
  async getOffers(tokenId: number) {
    try {
      const contract = await this.readMarketContract();
      if (contract) {
        const res = await contract.getOffers(tokenId);
        return res;
      }
      return null;
    } catch (error) {
      console.log("error");
      throw error;
    }
  }
}
export const marketService = new MarketplaceService();
