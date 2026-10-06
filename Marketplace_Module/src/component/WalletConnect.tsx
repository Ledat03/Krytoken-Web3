import { useContract } from "@/hooks/useContract";
import { useNFTContract } from "@/hooks/useNFTContract";
import { checkSignature } from "@/redux/slice/sliceSignature";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { type UserInfo, unauthorize } from "@/redux/slice/sliceSignature";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchPermission,
  savePermission,
  unauthorizePemission,
  type Permission,
} from "@/redux/slice/slicePermission";
import { LuCircleUser } from "react-icons/lu";
import { useEffect, useState } from "react";
import { Web3 } from "@/service/Web3Service";
import { toast } from "sonner";
import { logOut } from "@/service/MainService";
import { unauthorizeUser, type TokenInfo } from "@/redux/slice/sliceInfoToken";
import { ethers } from "ethers";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useAddressPermission } from "@/service/QueryService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const WalletConnect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectWallet, getSignature, approveTokens, error, switchAccount } =
    useContract();
  const { setApprovalForAll } = useNFTContract();
  const [Loading, setLoading] = useState<boolean>(false);
  const [PermissionAccount, setAccounts] = useState<string[] | undefined>(
    undefined,
  );
  const isConnected: boolean = useSelector(
    (state: RootState) => state?.Info.isConnected,
  );
  const account: string = useSelector(
    (state: RootState) => state?.Info.userAddress,
  );
  const KYSbalance: TokenInfo = useSelector(
    (state: RootState) => state?.Info.tokenList,
  );
  const UserData: UserInfo = useSelector(
    (state: RootState) => state.identifyAddress,
  );
  const PermissionState: Permission | null = useSelector(
    (state: RootState) => state.Permission.data,
  );
  const [sepoliaBalance, setBalance] = useState<string>("");
  const deployer = import.meta.env.VITE_DEPLOYER;
  const marketAdr = import.meta.env.VITE_Marketplace_CONTRACT_ADDRESS;
  const saleAddr = import.meta.env.VITE_TokenSale_CONTRACT_ADDRESS;
  const { pmsData, isLoading, refetch, status } = useAddressPermission(account);
  const checkConnect = async () => {
    const res: [] = await window.ethereum?.request({ method: "eth_accounts" });
    setAccounts(res);
    if (res) {
      const WalletConnect: boolean = res.length > 0 ? true : false;
      if (WalletConnect && UserData.nonce === 0) {
        await FetchInfoWallet();
      }
    }
  };
  const [DialogState, setDialog] = useState(false);
  useEffect(() => {
    checkConnect();
    if (error) {
      toast.error(error, { duration: 3000 });
    }
    if (UserData.nonce !== 0 && UserData.isAddressValid == false) {
      IdentifyUser();
    }

    if (account !== "" && UserData.isAddressValid) {
      if (
        pmsData === undefined &&
        PermissionState !== null &&
        (PermissionState.tokenAllowance === 0 ||
          PermissionState.nftAllowanceAll === false)
      ) {
        setDialog(true);
      }
    }
    if (Web3.getProvider() === null || Web3.getSigner() === null) {
      Web3.initCreate();
    } else {
      fetchBalance();
    }
  }, [isConnected, error, UserData.nonce, UserData.isAddressValid, pmsData]);
  const fetchBalance = async () => {
    const provider = Web3.getProvider();
    const signer = Web3.getSigner();
    if (provider && signer) {
      const balance = await provider?.getBalance(signer?.address);
      setBalance(ethers.formatEther(balance));
    }
  };
  const FetchInfoWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      toast.error("Failed to connect wallet");
      throw error;
    }
  };
  const SwitchAccount = async () => {
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
    dispatch(unauthorizePemission());
    dispatch(unauthorize());
    toast.success("Wallet is disconnected");
  };
  const approvePermissions = async () => {
    const idLoad = toast.loading("Transaction on progress...");
    if (!account) {
      toast.error("Metamask isn't connected !");
      return;
    }
    try {
      let currentPmsData = pmsData;
      if (currentPmsData === undefined) {
        const result = await refetch();
        currentPmsData = result.data;

        if (!currentPmsData) {
          toast.error("Can't fetch data");
          return;
        }
      }
      const permissionData: Permission = {
        address: account,
        tokenAllowance: 0,
        nftAllowanceAll: false,
      };

      let isApprovedToken = false;
      let isApprovedNFT = false;
      if (currentPmsData.kryptosApprovals?.length === 0) {
        isApprovedToken = await approveTokens(saleAddr, "100000");
      } else {
        isApprovedToken = true;
      }

      if (currentPmsData.approvalForAlls?.length === 0) {
        isApprovedNFT = await setApprovalForAll(marketAdr, true);
      } else {
        isApprovedNFT = true;
      }
      console.log(isApprovedNFT + " " + isApprovedToken);
      if (isApprovedToken || isApprovedNFT) {
        permissionData.tokenAllowance = isApprovedToken ? 100000 : 0;
        permissionData.nftAllowanceAll = isApprovedNFT;
        await dispatch(savePermission(permissionData));
        toast.success("Permission Allowed Successfully !");
      }

      if (!isApprovedToken) {
        toast.warning("You need allow token permission to trade on market");
      }
      if (!isApprovedNFT) {
        toast.warning("You need allow nft permission to trade on market");
      }
    } catch (error: any) {
      console.error("approvePermissions error:", error);

      if (error?.code === 4001 || error?.code === "ACTION_REJECTED") {
        toast.error("Transaction Canceled !");
      } else {
        toast.error(
          error?.shortMessage || error?.message || "something went wrong !",
        );
      }
    } finally {
      await refetch();
      toast.dismiss(idLoad);
    }
  };
  const IdentifyUser = async () => {
    try {
      await Web3.connectWallet();
      const signer = Web3.getSigner();
      if (!account || UserData.nonce === 0 || !signer) {
        return;
      }
      const signature = await getSignature(UserData.nonce.toString(), signer);
      const info = {
        nonce: UserData.nonce,
        address: signer.address,
        signature,
      };
      const result = await dispatch(checkSignature(info));
      if (result.meta.requestStatus !== "fulfilled") {
        toast.error("Unauthorized !");
        return;
      }
      const permissionResult = await dispatch(fetchPermission(account));
      if (permissionResult.meta.requestStatus !== "fulfilled") {
        return;
      }
    } catch (error: any) {
      console.error("IdentifyUser error:", error);

      if (error?.code === 4001 || error?.code === "ACTION_REJECTED") {
        toast.error("Transaction Canceled !");
      } else {
        toast.error("Something went wrong !");
      }
    }
  };
  const start = account.substring(0, 4);
  const end = account.substring(account.length, account.length - 4);

  return (
    <>
      {pmsData !== undefined &&
        (pmsData.approvalForAlls?.length === 0 ||
          pmsData.kryptosApprovals?.length === 0) && (
          <div className="">
            <p className="cookie-text text-xl">
              Allow permission to use this market{" "}
              <button
                type="button"
                className="btn-game cookie-text text-[17px]"
                onClick={() => setDialog(true)}
              >
                Sign
              </button>
            </p>
            <div className="absolute">
              <Dialog open={DialogState} onOpenChange={() => setDialog(false)}>
                <DialogContent className="comic-panel text-foreground border-[#2a3028]">
                  <DialogHeader>
                    <DialogTitle>Grant Marketplace Permissions</DialogTitle>
                    <DialogDescription>
                      To trade NFTs on this marketplace, you need to grant the
                      following permissions:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-sm">
                    <div className="rounded-md border p-3">
                      <p className="font-medium">1. Approve Token (KYS)</p>
                      <p className="text-muted-foreground mt-1">
                        Allow the Marketplace contract to spend your KYS tokens
                        so you can pay for NFTs when purchasing.
                      </p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="font-medium">2. Approve NFT</p>
                      <p className="text-muted-foreground mt-1">
                        Allow the Marketplace contract to manage your NFTs so
                        you can list and sell them.
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      You can revoke these permissions at any time in MetaMask.
                    </p>
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      className="btn-game"
                      onClick={() => setDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-game"
                      onClick={() => approvePermissions()}
                    >
                      Sign
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

      {PermissionAccount == undefined ||
      PermissionAccount.length === 0 ||
      account === undefined ? (
        <button
          type="button"
          className="btn-game"
          onClick={() => {
            FetchInfoWallet();
          }}
        >
          Connect
        </button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            {account && (
              <div className="drop-header">
                <LuCircleUser size={30} className="" />
                <p>
                  {start}...{end}
                </p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="comic-panel w-75 bg-card border-2 border-[#2a3028]">
            <DropdownMenuLabel className="py-2.5 px-2.5 flex justify-center items-center gap-1">
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
            <DropdownMenuItem
              className="header-setting"
              onClick={() => SwitchAccount()}
            >
              Switch Address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {account === deployer && (
              <DropdownMenuItem className="header-setting ">
                <a href="/home/market/configuration">Market Setting</a>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="header-setting">
              <a href="/home/nft/manage">Manage NFT</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="header-setting"
              onClick={DisconnectWallet}
            >
              <p>Disconnected</p>{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default WalletConnect;
