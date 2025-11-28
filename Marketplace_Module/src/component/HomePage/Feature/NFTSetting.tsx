import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
const NFTSetting = () => {
  const [Loading, setLoading] = useState<boolean>(false);
  const [URI, setURI] = useState<string>("");
  const [tempURI, setTemp] = useState<string>("");
  const { updateURI, baseURI, setApprovalForAll, approve } = useNFTContract();
  const [address, setAddress] = useState<string>("");
  const [approveAddress, setApprove] = useState({
    address: "",
    tokenId: 0,
  });
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
  useEffect(() => {
    getBaseURI();
  }, [Loading]);
  return (
    <div className="flex flex-col justify-center items-start w-fit gap-3 px-10">
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
            onClick={() => {
              try {
                toast.promise(
                  setApprovalForAll(address, true).then((receipt) => {
                    return receipt;
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
            }}
          >
            Change
          </Button>
        </div>
        <span className="text-green-500">Fill address you want to allow all permission to manage NFT </span>
      </div>
    </div>
  );
};
export default NFTSetting;
