import { useContract } from "@/hooks/useContract";
import { checkSignature } from "@/redux/slice/sliceSignature";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { nftService } from "@/service/RItemService";
import { useEffect, useState } from "react";
import { testExpiredToken } from "@/service/MainService";
import { ethers } from "ethers";
import { Web3 } from "@/service/Web3Service";

const WalletConnect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectWallet, getSignature } = useContract();
  const [Loading, setLoading] = useState<boolean>(false);
  const isConnected: boolean = useSelector((state: RootState) => state?.Info.isConnected);
  const account: string = useSelector((state: RootState) => state?.Info.userAddress);
  const nonce: number = useSelector((state: RootState) => state.identifyAddress.nonce);
  const [NFTContract, setNFTContract] = useState<ethers.Contract | null>(null);
  const deployer = import.meta.env.VITE_DEPLOYER;
  const checkConnect = async () => {
    let res = await window.ethereum?.request({ method: "eth_accounts" });
    let WalletConnect: boolean = res.length > 0 ? true : false;
    console.log("wallet connect", WalletConnect);
    if (WalletConnect) {
      await FetchInfoWallet();
    }
  };
  useEffect(() => {
    (async () => {
      await checkConnect();

      if (isConnected) {
        await fetchNFTContract();
      }
    })();
  }, [isConnected]);

  const fetchNFTContract = async () => {
    const res = await nftService.getContractNFT();
    setNFTContract(res);
  };
  const FetchInfoWallet = async () => {
    if (Loading) return;
    setLoading(true);
    try {
      await connectWallet();
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const SwitchAccount = async () => {
    if (!window.ethereum) return;
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
    await connectWallet();
  };

  const testApi = async () => {
    const res = await testExpiredToken();
    console.log(res);
  };
  const IdentifyUser = async () => {
    await Web3.connectWallet();
    const signer = Web3.getSigner();

    if (account && nonce !== 0 && signer !== null) {
      console.log(account, "    ", signer.getAddress());
      const signature = await getSignature(nonce.toString(), signer);
      const Info = {
        nonce: nonce,
        address: signer.address,
        signature: signature,
      };
      console.log("Info", Info);
      dispatch(checkSignature(Info));
    }
    console.log(`return ${account} ${nonce} ${signer}`);
    return;
  };
  let start = account.substring(0, 4);
  let end = account.substring(account.length, account.length - 4);
  return (
    <>
      {!isConnected ? (
        <button
          onClick={() => {
            FetchInfoWallet();
          }}
        >
          Connect
        </button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            {start}...{end}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => SwitchAccount()}>Switch Address</DropdownMenuItem>
            <DropdownMenuItem onClick={() => IdentifyUser()}>Identify</DropdownMenuItem>
            {account === deployer && (
              <DropdownMenuItem>
                <a href="/market/configuration">Market Setting</a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <a href="/nft/manage">Manage NFT</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={testApi}>Disconnected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default WalletConnect;
