import { useContract } from "@/hooks/useContract";
import { checkSignature } from "@/redux/slice/sliceSignature";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Web3 } from "@/service/Web3Service";
import { toast } from "sonner";
import { logOut } from "@/service/MainService";
import { unauthorizeUser } from "@/redux/slice/sliceInfoToken";
const WalletConnect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectWallet, getSignature, error } = useContract();
  const [Loading, setLoading] = useState<boolean>(false);
  const [PermissionAccount, setAccounts] = useState<[] | undefined>(undefined);
  const isConnected: boolean = useSelector((state: RootState) => state?.Info.isConnected);
  const account: string = useSelector((state: RootState) => state?.Info.userAddress);
  const nonce: number = useSelector((state: RootState) => state.identifyAddress.nonce);
  const isVerified: boolean = useSelector((state: RootState) => state.identifyAddress.isAddressValid);

  const deployer = import.meta.env.VITE_DEPLOYER;
  const checkConnect = async () => {
    let res: [] = await window.ethereum?.request({ method: "eth_accounts" });
    setAccounts(res);
    if (res) {
      let WalletConnect: boolean = res.length > 0 ? true : false;
      console.log("wallet connect", WalletConnect);
      if (WalletConnect && nonce === 0) {
        await FetchInfoWallet();
      }
    }
  };
  useEffect(() => {
    console.log(nonce);
    checkConnect();
    if (error) {
      toast.error(error, { duration: 3000 });
    }
    if (nonce !== 0 && isVerified == false) {
      console.log("Value : ", nonce);
      IdentifyUser();
    }
  }, [isConnected, error, nonce]);
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

  const DisconnectWallet = async () => {
    try {
      localStorage.removeItem("accessToken");
      if (window.ethereum?.request) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
      await logOut();
      dispatch(unauthorizeUser());
      toast.success("Wallet is disconnected");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      throw error;
    }
  };
  const IdentifyUser = async () => {
    await Web3.connectWallet();
    const signer = Web3.getSigner();

    console.log(account, " 1", nonce !== 0, signer !== null);
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
      {PermissionAccount == undefined || PermissionAccount.length === 0 ? (
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
          <DropdownMenuContent className="dark">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => SwitchAccount()}>Switch Address</DropdownMenuItem>
            {account === deployer && (
              <DropdownMenuItem>
                <a href="/home/market/configuration">Market Setting</a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <a href="/home/nft/manage">Manage NFT</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={DisconnectWallet}>Disconnected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default WalletConnect;
