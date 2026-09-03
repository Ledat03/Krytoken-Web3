import { useContract } from "@/hooks/useContract";
import { useNFTContract } from "@/hooks/useNFTContract";
import { checkSignature } from "@/redux/slice/sliceSignature";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchPermission, savePermission, type Permission } from "@/redux/slice/slicePermission";
import { LuCircleUser } from "react-icons/lu";
import { useEffect, useState } from "react";
import { Web3 } from "@/service/Web3Service";
import { toast } from "sonner";
import { logOut } from "@/service/MainService";
import { unauthorizeUser, type TokenInfo } from "@/redux/slice/sliceInfoToken";
import { ethers } from "ethers";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
const WalletConnect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectWallet, getSignature, approveTokens, error ,switchAccount } = useContract();
  const { setApprovalForAll } = useNFTContract();
  const [Loading, setLoading] = useState<boolean>(false);
  const [PermissionAccount, setAccounts] = useState<[] | undefined>(undefined);
  const isConnected: boolean = useSelector((state: RootState) => state?.Info.isConnected);
  const account: string = useSelector((state: RootState) => state?.Info.userAddress);
  const KYSbalance: TokenInfo = useSelector((state: RootState) => state?.Info.tokenList);
  const nonce: number = useSelector((state: RootState) => state.identifyAddress.nonce);
  const isVerified: boolean = useSelector((state: RootState) => state.identifyAddress.isAddressValid);
  const [sepoliaBalance, setBalance] = useState<string>("");
  const deployer = import.meta.env.VITE_DEPLOYER;
  const marketAdr = import.meta.env.VITE_Marketplace_CONTRACT_ADDRESS;
  const checkConnect = async () => {
    const res: [] = await window.ethereum?.request({ method: "eth_accounts" });
    setAccounts(res);
    if (res) {
      const WalletConnect: boolean = res.length > 0 ? true : false;
      console.log("wallet connect", WalletConnect);
      if (WalletConnect && nonce === 0) {
        await FetchInfoWallet();
      }
    }
  };
  useEffect(() => {
    checkConnect();
    if (error) {
      toast.error(error, { duration: 3000 });
    }
    if (nonce !== 0 && isVerified == false) {
      IdentifyUser();
    }
    if (Web3.getProvider() === null || Web3.getSigner() === null) {
      Web3.initCreate();
    } else {
      fetchBalance();
    }
  }, [isConnected, error, nonce]);
  const fetchBalance = async () => {
    const provider = Web3.getProvider();
    const signer = Web3.getSigner();
    if (provider && signer) {
      const balance = await provider?.getBalance(signer?.address);
      setBalance(ethers.formatEther(balance));
    }
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
    console.log("switch")
    if (!window.ethereum) return;
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
    await switchAccount();
  };

  const DisconnectWallet = async () => {
      localStorage.removeItem("accessToken");
      if (window.ethereum?.request) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
      await logOut(account);
      dispatch(unauthorizeUser());
      toast.success("Wallet is disconnected");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } 

  const IdentifyUser = async () => {
    await Web3.connectWallet();
    const signer = Web3.getSigner();
    if (account && nonce !== 0 && signer !== null) {
      const signature = await getSignature(nonce.toString(), signer);
      const Info = {
        nonce: nonce,
        address: signer.address,
        signature: signature,
      };
      const data = await dispatch(checkSignature(Info));
      if (data.meta.requestStatus === "fulfilled") {
        const isVerified: boolean = data.payload.verified;
        if (account !== "" && isVerified) {
          const permissionData = await dispatch(fetchPermission(account));
          if ((permissionData.meta.requestStatus === "fulfilled" && permissionData.payload.tokenAllowance === 0) || permissionData.payload.nftAllowanceAll === false) {
            try {
              await approveTokens(marketAdr, "100000");
              await setApprovalForAll(marketAdr, true);
              const permissionData: Permission = {
                address: account,
                tokenAllowance: 100000,
                nftAllowanceAll: true,
              };
              await dispatch(savePermission(permissionData));
              toast.success("Anything is set, You can change information in setting !");
            } catch (error) {
              toast.error("Something went wrong");
              throw error;
            }
          }
        }
      }
    }
    return;
  };
  const start = account.substring(0, 4);
  const end = account.substring(account.length, account.length - 4);
  return (
    <>
      {PermissionAccount == undefined || PermissionAccount.length === 0 || account === undefined ? (
        <button
          onClick={() => {
            FetchInfoWallet();
          }}
        >
          Connect
        </button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <p>
              <LuCircleUser size={30} className=" absolute left-[-35px] top-[-5px]" />
              {start}...{end}
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark w-[300px]">
            <DropdownMenuLabel className="py-[10px] px-[10px]">
              <p className=" text-sm">Wallet Connected :</p>
              <p>
                {start}...{end}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className=" flex-col items-start text-[15px] px-3">
              <div className="flex justify-between items-center ">
                <p className="my-2">{Number(sepoliaBalance).toFixed(4)}</p>
                <p> Sepolia</p>
              </div>
              <div className="flex justify-between items-center ">
                <p className="my-2">{KYSbalance.balance}</p>
                <p> {KYSbalance.symbol}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="header-setting" onClick={() => SwitchAccount()}>
              Switch Address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {account === deployer && (
              <DropdownMenuItem className="header-setting ">
                <a href="/home/market/configuration">Market Setting</a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="header-setting">
              <a href="/home/nft/manage">Manage NFT</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="header-setting" onClick={DisconnectWallet}>
              <p>Disconnected</p>{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default WalletConnect;
