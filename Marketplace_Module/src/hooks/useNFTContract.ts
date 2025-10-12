import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useCallback } from "react";
import { nftService } from "@/service/RItemService";
import type { ethers } from "ethers";
import { getInitInfo } from "@/redux/slice/sliceNFTContract";
export const useNFTContract = () => {
  const dispatch = useDispatch();
  const name: string = useSelector((state: RootState) => state.contractInfo.name);
  const symbol: string = useSelector((state: RootState) => state.contractInfo.symbol);
  const owner: string = useSelector((state: RootState) => state.contractInfo.owner);
  const balance: number = useSelector((state: RootState) => state.contractInfo.balance);

  const fetchInfoContract = useCallback(async () => {
    const contract: ethers.Contract | null = await nftService.getContractNFT();
    if (contract) {
      const fetchName: string | null = await nftService.getName();
      const fetchSymbol: string | null = await nftService.getSymbol();
      const fetchOwner: string | null = await nftService.getOwner();
      const fetchBalance: number | null = Number(await nftService.getNFTBalance());
      dispatch(getInitInfo({ name: fetchName, symbol: fetchSymbol, owner: fetchOwner, balance: fetchBalance?.valueOf() }));
      return contract;
    } else {
      return null;
    }
  }, []);

  const updateURI = useCallback(async (newURI: string) => {
    try {
      const contract: ethers.Contract | null = await nftService.getContractNFT();
      if (contract) {
        const update: boolean = await nftService.updateBaseURI(newURI);
        return update;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const approve = useCallback(async (address: string, tokenId: number) => {
    try {
      const contract: ethers.Contract | null = await nftService.getContractNFT();
      if (contract) {
        const isApproved: boolean = await nftService.approve(address, tokenId);
        return isApproved;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const setApprovalForAll = useCallback(async (address: string, Approved: boolean) => {
    try {
      const contract: ethers.Contract | null = await nftService.getContractNFT();
      if (contract) {
        const isApproved: boolean = await nftService.setApprovalForAll(address, Approved);
        return isApproved;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const getTokenURI = useCallback(async (tokenId: number) => {
    try {
      const contract: ethers.Contract | null = await nftService.getContractNFT();
      if (contract) {
        const URI: string | null = await nftService.getTokenURI(tokenId);
        return URI;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  const transferFrom = useCallback(async (from: string, to: string, tokenId: number) => {
    try {
      const contract: ethers.Contract | null = await nftService.getContractNFT();
      if (contract) {
        const URI: boolean = await nftService.transferFrom(from, to, tokenId);
        return URI;
      }
    } catch (error) {
      throw error;
    }
  }, []);
  return {
    name,
    symbol,
    owner,
    balance,
    approve,
    fetchInfoContract,
    updateURI,
    setApprovalForAll,
    getTokenURI,
    transferFrom,
  };
};
