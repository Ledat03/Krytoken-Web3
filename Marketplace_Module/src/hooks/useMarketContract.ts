import { marketService } from "@/service/MarketplaceService";
import { ethers } from "ethers";
import { useCallback } from "react";

export const useMarketContract = () => {
  const connectMarket = useCallback(async () => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) return contract;
    } catch (error) {
      throw error;
    }
  }, []);
  const updateFeeRate = useCallback(async (feeByDecimal: number, feeRate: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.updateFeeRate(feeByDecimal, feeRate);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const updateFeeRecipient = useCallback(async (fee: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.updateFeeRecipient(fee);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const isSeller = useCallback(async (orderId: number, seller: string) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.isSeller(orderId, seller);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const isTokenSupported = useCallback(async (tokenAddress: string) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.isTokenSupported(tokenAddress);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const addNewToken = useCallback(async (tokenAddress: string) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.addNewToken(tokenAddress);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const cancelOrder = useCallback(async (orderId: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.cancelOrder(orderId);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const executeOrder = useCallback(async (orderId: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const response = await marketService.executeOrder(orderId);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const addOrder = useCallback(async (tokenId: number, price: number, tokenAddress: string) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const convertPrice = ethers.parseEther(String(price));
        const response = await marketService.addOrder(tokenId, convertPrice, tokenAddress);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const createOffer = useCallback(async (price: number, transferToken: string, tokenId: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        let amount = ethers.parseEther(String(price));
        const res = await marketService.createOffer(amount, transferToken, tokenId);
        return res;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const acceptOffer = useCallback(async (tokenId: number, index: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const res = await marketService.acceptOffer(tokenId, index);
        return res;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const cancelOffer = useCallback(async (tokenId: number, index: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const res = await marketService.cancelOffer(tokenId, index);
        return res;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const getOffers = useCallback(async (tokenId: number) => {
    try {
      const contract = await marketService.getMarketContract();
      if (contract) {
        const res = await marketService.getOffers(tokenId);
        return res;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  return {
    connectMarket,
    updateFeeRate,
    updateFeeRecipient,
    isSeller,
    isTokenSupported,
    cancelOrder,
    executeOrder,
    addNewToken,
    acceptOffer,
    createOffer,
    cancelOffer,
    getOffers,
    addOrder,
  };
};
