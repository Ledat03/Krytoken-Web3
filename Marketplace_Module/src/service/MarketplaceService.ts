import { ethers } from "ethers";
import ABI_marketplace from "../../contracts/marketplace/Marketplace.sol/Marketplace.json";
import { Web3Service } from "./Web3Service";
export const ABI_interact = ABI_marketplace.abi;

class MarketplaceService extends Web3Service {
  constructor() {
    super();
  }

  async getContractMarket(): Promise<ethers.Contract | null> {
    if (!this.provider || !this.signer) {
      this.initCreate();
    }
    return new ethers.Contract("0xf3Ee934423eed82502BC7Cb89c936BE578bCFC69", ABI_interact, this.signer);
  }
}
export const marketService = new MarketplaceService();
