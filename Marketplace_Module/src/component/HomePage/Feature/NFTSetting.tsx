import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { savePermission, type Permission } from "@/redux/slice/slicePermission";
import type { AppDispatch } from "@/redux/store";
interface TokenWalletProps {
  data: Permission | null;
  state: React.Dispatch<React.SetStateAction<number>>;
}
const NFTSetting = ({ data, state }: TokenWalletProps) => {
  const [Loading, setLoading] = useState<boolean>(false);
  const [URI, setURI] = useState<string>("");
  const [tempURI, setTemp] = useState<string>("");
  const { updateURI, baseURI, setApprovalForAll, approve } = useNFTContract();
  const [address, setAddress] = useState<string>("");
  const [approveAddress, setApprove] = useState({
    address: "",
    tokenId: 0,
  });
  const MarketAddress: string = import.meta.env.VITE_Marketplace_CONTRACT_ADDRESS;

  console.log(data);
  const dispatch = useDispatch<AppDispatch>();
  const signer = useSelector((state: RootState) => state.Info.userAddress);
  const deployer = import.meta.env.VITE_DEPLOYER;
  const changeURI = async (value: string) => {
    await updateURI(value);
  };
  const getBaseURI = async () => {
    try {
      const res = await baseURI();
      if (res) setURI(res);
    } catch (error) {
      throw error;
    }
  };
  const setApproveAll = async () => {
    try {
      setLoading(true);
      toast.promise(
        setApprovalForAll(address, true)
          .then((receipt) => {
            return receipt;
          })

          .then((receipt) => {
            if (address === MarketAddress && data) {
              console.log("save");

              const reqData: Permission = {
                address: data?.address,
                tokenAlowance: data?.tokenAlowance,
                nftAlowanceAll: true,
              };
              dispatch(savePermission(reqData));
            }
            return receipt;
          })
          .then(() => {
            state((prev) => prev + 1);
          }),
        {
          loading: "Confirm Approve...",
          success: () => `Approved permission for ${address.substring(0, 4)}...${address.substring(address.length, address.length - 4)}`,
          error: (err) => err?.shortMessage ?? err?.message ?? "Failed to update base URI",
        }
      );
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBaseURI();
  }, [Loading]);
  return (
    <div className="flex flex-col justify-center items-start w-fit gap-3 px-10">
      {data?.nftAlowanceAll && (
        <div className="flex gap-3 items-center justify-center border border-green-500 rounded-lg p-2 w-full">
          <span className="text-green-500">You have already approved permission for all NFTs</span>
        </div>
      )}
      {signer === deployer && (
        <>
          <div className="my-2">
            <div className="flex gap-3 items-center justify-start">
              <span>Base URI</span>
              <Input
                className="w-[280px]"
                placeholder={`Your current base URI : ${URI}`}
                onChange={(e) => {
                  setTemp(e.target.value);
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  try {
                    setLoading(true);
                    toast.promise(
                      changeURI(tempURI).then((receipt) => {
                        getBaseURI();
                        return receipt;
                      }),
                      {
                        loading: "Updating base URI...",
                        success: () => `Base URI updated. ${URI}`,
                        error: (err) => err?.shortMessage ?? err?.message ?? "Failed to update base URI",
                      }
                    );
                  } catch (error) {
                    throw error;
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Change
              </Button>
            </div>
            <span className="text-green-500">This is the base URI where you store your NFT metadata</span>
          </div>{" "}
        </>
      )}

      <div className="my-2">
        <div className="flex gap-3 items-center">
          <span>Approval</span>
          <Input
            className="w-[400px]"
            placeholder={`E.g : 0xAbdc`}
            onChange={(e) => {
              setApprove({ ...approveAddress, address: e.target.value });
            }}
          />
          <Input
            className="w-[100px]"
            type="number"
            placeholder={`Token ID`}
            onChange={(e) => {
              setApprove({ ...approveAddress, tokenId: Number(e.target.value) });
            }}
          />

          <Button
            type="button"
            onClick={() => {
              try {
                toast.promise(
                  approve(approveAddress.address, approveAddress.tokenId).then((receipt) => {
                    return receipt;
                  }),
                  {
                    loading: "Confirm Approve...",
                    success: () => `Approved permission for ${approveAddress.address.substring(0, 4)}...${approveAddress.address.substring(approveAddress.address.length, approveAddress.address.length - 4)}`,
                    error: (err) => err?.shortMessage ?? err?.message ?? "Failed to update base URI",
                  }
                );
              } catch (error) {
                throw error;
              } finally {
                setLoading(false);
              }
            }}
          >
            Approve
          </Button>
        </div>{" "}
        <span className="text-green-500">Fill address you want to allow permission to manage NFT </span>
      </div>
      <div>
        <div className="flex gap-3 items-center">
          <span className="text-md font-bold">Approval All</span>
          <Input
            className="w-[400px]"
            placeholder={`E.g : 0xAbcd`}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          <Button
            type="button"
            onClick={async () => {
              await setApproveAll();
            }}
          >
            {Loading ? "Approving..." : "Approve"}
          </Button>
        </div>
        <span className="text-green-500">Fill address you want to allow all permission to manage NFT </span>
      </div>
    </div>
  );
};
export default NFTSetting;
