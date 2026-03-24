import TokenSale_ABI from "../../contracts/TokenSale/TokenSale.json";
import { Web3Service } from "./Web3Service";
import { ethers } from "ethers";
let ABI = TokenSale_ABI.abi;
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
        await contract.buy({ value: ethers.parseEther(amount) });
      } catch (error) {
        console.error(error);
      }
    }
  }
  async Sell(amount: string) {
    const contract = await this.getContract();
    if (contract != null) {
      try {
        await contract.sell(ethers.parseEther(amount));
      } catch (error) {
        console.error(error);
      }
    }
  }
}
export const tokenSaleService = new TokenSaleService();
