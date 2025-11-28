// Web3Service.ts
import { ethers } from "ethers";

export class Web3Service {
  protected provider: ethers.BrowserProvider | null = null;
  protected signer: ethers.JsonRpcSigner | null = null;

  constructor() {}

  protected async initCreate() {
    if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
    } else {
      console.error("MetaMask not detected!");
    }
  }
  public async connectWallet() {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
       
        if (accounts) {
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
        }
        if (this.signer) return this.signer?.address;
      } else {
        return "You Don't Have MetaMask";
      }
    } catch (error) {
      throw error;
    }
  }
  public getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  public getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }
  public setSigner() {
    this.signer = null;
  }
}
export const Web3 = new Web3Service();
