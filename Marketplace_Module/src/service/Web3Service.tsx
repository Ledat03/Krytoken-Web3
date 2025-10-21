// Web3Service.ts
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { unauthorizeUser } from "@/redux/slice/sliceInfoToken";
export function logoutMetaMaskWallet() {
  const dispatch = useDispatch();
  try {
    localStorage.removeItem("accessToken");
    if (window.ethereum && typeof window.ethereum.removeAllListeners === "function") {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
      window.ethereum.removeAllListeners("disconnect");
    }
    dispatch(unauthorizeUser());
  } catch (error) {
    throw error;
  }
}
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
    if (typeof window !== "undefined" && window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
      }
      const address = this.signer?.getAddress();
      return address;
    }
    return null;
  }
  public getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  public getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }
}
export const Web3 = new Web3Service();
