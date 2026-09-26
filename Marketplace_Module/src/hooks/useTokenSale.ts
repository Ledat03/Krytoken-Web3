/* eslint-disable no-useless-catch */
import { useCallback } from "react";
import { ethers } from "ethers";
import { tokenSaleService } from "../service/TokenSaleService";
import { toast } from "sonner";
const useTokenSale = () => {
  const getTokenSaleContract = useCallback(async (): Promise<ethers.Contract | null> => {
    const contract: ethers.Contract | null = await tokenSaleService.getContract();
    if (contract) return contract;
    return null;
  }, []);
  const buyToken = useCallback(async (amount: string): Promise<boolean> => {
    try {
      const result = await tokenSaleService.Buy(amount);
      if (result) {
        return result;
      }
    } catch (error) {
      throw error;
    }
    return false;
  }, []);
  const sellToken = useCallback(async (amount: string): Promise<boolean> => {
    try {
      const tx = await tokenSaleService.Sell(amount);
      if (tx) {
        toast.success("Tokens sold successfully!");
        return true;
      }
    } catch (error) {
      toast.error("Failed to sell tokens");
      throw error;
    }
    return false;
  }, []);
  return {
    getTokenSaleContract,
    buyToken,
    sellToken,
  };
};
export default useTokenSale;
