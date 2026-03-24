import { useCallback } from "react";
import { ethers } from "ethers";
import { tokenSaleService } from "../service/TokenSaleService";
const useTokenSale = () => {
  const getTokenSaleContract = useCallback(async (): Promise<ethers.Contract | null> => {
    const contract: ethers.Contract | null = await tokenSaleService.getContract();

    if (contract) {
      console.log(await contract.checkNativeBalance());
      return contract;
    }
    return null;
  }, []);
  const buyToken = useCallback(async (amount: string): Promise<boolean> => {
    try {
      await tokenSaleService.Buy(amount);
      return true;
    } catch (error) {}
    return false;
  }, []);
  const sellToken = useCallback(async (amount: string): Promise<boolean> => {
    try {
      await tokenSaleService.Sell(amount);
      return true;
    } catch (error) {}
    return false;
  }, []);
  return {
    getTokenSaleContract,
    buyToken,
    sellToken,
  };
};
export default useTokenSale;
