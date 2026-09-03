import TokenSale_ABI from "../../contracts/TokenSale/TokenSale.json";
import { Web3Service } from "./Web3Service";
import { ethers } from "ethers";
const ABI = TokenSale_ABI.abi;
const contract = import.meta.env.VITE_TokenSale_CONTRACT_ADDRESS;
class TokenSaleService extends Web3Service {
  constructor() {
    super();
  }

  async getContract(): Promise<ethers.Contract | null> {
    if (!this.provider || !this.signer) {
      await this.initCreate();
    }
    return await new ethers.Contract(contract, ABI, this.signer);
  }
  async Buy(amount: string) {
    const contract = await this.getContract();
    if (contract != null) {
      try {
        const tx = await contract.buy({ value: ethers.parseEther(amount) });
        const result = await tx.wait();
        if (result && result.status === 1) {
          return true;
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
  async Sell(amount: string) {
    const contract = await this.getContract();
    if (contract != null) {
      try {
        const tx = await contract.sell(ethers.parseEther(amount));
        const result = await tx.wait();
        if (result && result.status === 1) {
          return true;
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
}
export const tokenSaleService = new TokenSaleService();
