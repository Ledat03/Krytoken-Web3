import { useContract } from "@/hooks/useContract";
import { contractService } from "@/service/KYSContractService";
import { checkSignature } from "@/redux/slice/sliceSignature";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { nftService } from "@/service/RItemService";
import { useEffect, useState } from "react";
import { testExpiredToken } from "@/service/MainService";
import { marketService } from "@/service/MarketplaceService";
import { ethers } from "ethers";
import { Web3 } from "@/service/Web3Service";
const WalletConnect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectWallet, getSignature } = useContract();
  const [Loading, setLoading] = useState<boolean>(false);
  const isConnected: boolean = useSelector((state: RootState) => state?.Info.isConnected);
  const account: string = useSelector((state: RootState) => state?.Info.userAddress);
  const nonce: number = useSelector((state: RootState) => state.identifyAddress.nonce);
  const [MarketplaceContract, setContract] = useState<ethers.Contract | null>(null);
  const [NFTContract, setNFTContract] = useState<ethers.Contract | null>(null);
  console.log("NFTContract", NFTContract);
  console.log("account : ", account);
  console.log(nonce);
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
        await getInfoContract();
      }
    })();
  }, [isConnected]);
  const fetchContract = async () => {
    const res = await marketService.getContractMarket();
    setContract(res);
  };
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
  const getname = async () => {
    let res = await MarketplaceContract?.isTokenSupported("0x29Db3E8c725261a6D40c2071770a72e7748Bc33B");
    console.log(res);
  };
  const getInfoContract = async () => {
    console.log("contract", await contractService.listenTransfers());
    if (NFTContract) {
      let name = await nftService.getName();
      let owner = await nftService.getOwner();
      let symbol = await nftService.getSymbol();
      let balance = await nftService.getBalanceOf(account);
      console.log(`NFT Contract Information : ${name} , ${owner} , ${symbol}, ${balance}`);
    }
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
            <DropdownMenuItem
              onClick={async () => {
                await fetchContract();
                await getname();
              }}
            >
              Connect Market Contract
            </DropdownMenuItem>
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
