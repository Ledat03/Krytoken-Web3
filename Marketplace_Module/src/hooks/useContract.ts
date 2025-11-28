import { useState, useEffect, useCallback } from "react";
import { contractService } from "../service/KYSContractService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import type { TokenInfo, Network } from "@/redux/slice/sliceInfoToken";
import { getUserInfo, fetchUserSwitch } from "@/redux/slice/sliceInfoToken";
import { fetchInfoUser } from "@/redux/slice/sliceSignature";
import type { JsonRpcSigner } from "ethers";

export const useContract = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isConnected: boolean = useSelector((state: RootState) => state?.Info.isConnected);
  const account: string = useSelector((state: RootState) => state?.Info.userAddress);
  const networkInfo: Network = useSelector((state: RootState) => state?.Info.networks);
  const tokens: TokenInfo[] = useSelector((state: RootState) => state.Info.tokenList);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const connectedAccount = await contractService.connectWallet();
      if (connectedAccount && connectedAccount.substring(0, 2) === "0x") {
        const networkData = await loadNetworkInfo();
        const tokenData = await loadTokenBalances(connectedAccount);
        dispatch(getUserInfo({ userAddress: connectedAccount, networks: networkData, tokenList: tokenData, isConnected: true }));
        const value = await dispatch(fetchInfoUser(connectedAccount.toString()));
        console.log(value);
        return connectedAccount;
      } else {
        console.error("Failed to connect wallet");
        setError(connectedAccount || "Fail to connect");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNetworkInfo = useCallback(async () => {
    try {
      const network = await contractService.getNetworkInfo();
      return network;
    } catch (err) {
      console.error("Error loading network info:", err);
    }
  }, []);

  const loadTokenBalances = useCallback(
    async (balanceAddress: string) => {
      if (!balanceAddress) return;
      setLoading(true);
      try {
        const tokenList: TokenInfo[] = [{ address: import.meta.env.VITE_KYS_CONTRACT_ADDRESS, symbol: "KYS", balance: "0", decimals: 18 }];

        for (const token of tokenList) {
          if (token.address && token.address !== "0x...") {
            const balance = await contractService.getTokenBalance(balanceAddress);
            token.balance = balance;
          }
        }

        return tokenList;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading token balances");
      } finally {
        setLoading(false);
      }
    },
    [account]
  );

  const transferTokens = useCallback(
    async (to: string, amount: string) => {
      setLoading(true);
      setError(undefined);
      try {
        const success = await contractService.transferToken(to, amount);
        if (success) {
          await loadTokenBalances(account);
          return true;
        } else {
          setError("Transfer failed");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transfer failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadTokenBalances]
  );

  const getSignature = useCallback(async (nonce: string, address: JsonRpcSigner) => {
    setLoading(true);
    setError(undefined);
    try {
      const success = await contractService.signMessage(nonce, address);
      return success;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveTokens = useCallback(async (spender: string, amount: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const success = await contractService.approveToken(spender, amount);
      if (success) {
        return true;
      } else {
        setError("Approval failed");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const currentAccount = await contractService.getCurrentAccount();
        if (currentAccount) {
          const networkData = await loadNetworkInfo();
          const tokenData = await loadTokenBalances(currentAccount);
          dispatch(getUserInfo({ userAddress: currentAccount, networks: networkData, tokenList: tokenData, isConnected: true }));
        }
      } catch (err) {
        console.log("Wallet not connected");
      }
    };

    checkConnection();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length === 0) {
          dispatch(fetchUserSwitch({ userAddress: "", tokenList: [] }));
        } else {
          const tokenData = await loadTokenBalances(account);
          dispatch(fetchUserSwitch({ userAddress: accounts[0], tokenList: tokenData, isConnected: false }));
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [loadNetworkInfo, loadTokenBalances]);

  return {
    isConnected,
    account,
    networkInfo,
    tokens,
    loading,
    error,
    getSignature,
    connectWallet,
    transferTokens,
    approveTokens,
    loadTokenBalances,
    clearError: () => setError(undefined),
  };
};
