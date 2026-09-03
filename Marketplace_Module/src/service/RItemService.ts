import { ethers } from "ethers";
import ABI_NFT from "../../contracts/NFT/RItem.json";
import { Web3Service } from "./Web3Service";
const ABI = ABI_NFT.abi;
const NFTContract: string = `${import.meta.env.VITE_RItem_CONTRACT_ADDRESS}`;

class NFTService extends Web3Service {
  constructor() {
    super();
  }
  async getContractNFT(): Promise<ethers.Contract | null> {
    if (!this.provider || !this.signer) {
      await this.initCreate();
    }
    return new ethers.Contract(NFTContract, ABI, this.signer);
  }

  async getNFTBalance(): Promise<number | null> {
    const contract = await this.getContractNFT();
    if (contract) {
      try {
        const balance: number = await contract.balanceOf(this.signer);
        return balance;
      } catch (e) {
        throw e;
      }
    }
    return null;
  }
  async getOwner(): Promise<string | null> {
    const contract = await this.getContractNFT();
    if (contract) {
      try {
        const owner: string = await contract.owner();
        return owner;
      } catch (e) {
        throw e;
      }
    }
    return null;
  }
  async mintWithURI(tokenURL: string, address: string): Promise<boolean | undefined> {
    const contract = await this.getContractNFT();
    const owner: string | null = await this.getOwner();
    console.log("owner ", owner);
    console.log("signer , ", address);
    if (contract && owner != null && address === owner) {
      try {
        const tx = await contract.mintWithURI(address, tokenURL);
        const result = await tx.wait();
        console.log(await result);
        if (result) {
          return true;
        }
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }
  async updateBaseURI(newURI: string): Promise<boolean> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      try {
        const tx = await resContract._updateBaseURI(newURI);
        const result = await tx.wait();
        if (result.status == 1) return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  }
  async getBaseURI() {
    const contract = await this.getContractNFT();
    if (contract) {
      try {
        const res = await contract.getBaseURI();
        return res;
      } catch (error) {
        throw error;
      }
    }
    return;
  }
  async approve(address: string, tokenId: number): Promise<boolean> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      try {
        const tx = await resContract.approve(address, tokenId);
        const result = await tx.wait();
        if (result.status == 1) return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  }
  async setApprovalForAll(address: string, isApproved: boolean): Promise<boolean> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      try {
        const tx = await resContract.setApprovalForAll(address, isApproved);
        const result = tx.wait();
        if (result.status == 1) return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  }
  async transferFrom(from: string, to: string, tokenId: number): Promise<boolean> {
    const resContract = await this.getContractNFT();

    if (resContract) {
      try {
        const tx = await resContract.transferFrom(from, to, tokenId);
        const result = tx.wait();
        if (result.status == 1) return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  }

  async getBalanceOf(address: string): Promise<number | null> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      const res: number = await resContract.balanceOf(address);
      return res;
    }
    return null;
  }
  async getName(): Promise<string | null> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      const res: string = await resContract.name();
      return res;
    }
    return null;
  }
  async getSymbol(): Promise<string | null> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      const res: string = await resContract.symbol();
      return res;
    }
    return null;
  }

  async getOwnerOf(tokenId: number): Promise<string | null> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      const res: string = await resContract.ownerOf(tokenId);
      return res;
    }
    return null;
  }
  async getTokenURI(tokenId: number): Promise<string | null> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      const res: string = await resContract.tokenURI(tokenId);
      return res;
    }
    return null;
  }
}
export const nftService = new NFTService();
