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

    return new ethers.Contract(NFTContract, ABI, this.provider);
  }

  //Main Action
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
  async mintWithURI(tokenURL: string, address: string): Promise<string | undefined> {
    const contract = await this.getContractNFT();
    const owner: string | null = await this.getOwner();
    if (contract && owner != null && address === owner) {
      try {
        const tokenId = await contract.mint(tokenURL);
        return tokenId;
      } catch (e) {
        throw e;
      }
    }
  }
  async updateBaseURI(newURI: string): Promise<boolean> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      try {
        await resContract._updateBaseURI(newURI);
        return true;
      } catch (error) {
        throw error;
      }
    }
    return false;
  }

  async approve(address: string, tokenId: number): Promise<boolean> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      try {
        await resContract.approve(address, tokenId);
        return true;
      } catch (error) {
        throw error;
      }
    }
    return false;
  }
  async setApprovalForAll(address: string, isApproved: boolean): Promise<boolean> {
    const resContract = await this.getContractNFT();
    if (resContract) {
      try {
        await resContract.setApprovalForAll(address, isApproved);
        return true;
      } catch (error) {
        throw error;
      }
    }
    return false;
  }
  async transferFrom(from: string, to: string, tokenId: number): Promise<boolean> {
    const resContract = await this.getContractNFT();

    if (resContract) {
      try {
        await resContract.transferFrom(from, to, tokenId);
        return true;
      } catch (error) {
        throw error;
      }
    }
    return false;
  }
  //View Function

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
