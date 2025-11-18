import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTCard from "./NFTCard";
import { useEffect, useState } from "react";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useListNFTs } from "@/service/QueryService";
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export default function NFTManager() {
  const [Loading, setLoading] = useState<boolean>(false);
  const [URI, setURI] = useState<string>("");
  const [tempURI, setTemp] = useState<string>("");
  const { updateURI, baseURI, setApprovalForAll, approve } = useNFTContract();
  const { status, fillData } = useListNFTs();
  const mNFTs = useSelector((state: RootState) => state.InfoNFTs.ListNFTs);
  const [address, setAddress] = useState<string>("");
  const [approveAddress, setApprove] = useState({
    address: "",
    tokenId: 0,
  });
  useEffect(() => {
    getListNFTs();
    getBaseURI();
  }, [status, Loading]);

  const getListNFTs = async () => {
    await fillData();
  };
  const getBaseURI = async () => {
    try {
      const res = await baseURI();
      if (res) setURI(res);
    } catch (error) {
      throw error;
    }
  };
  const changeURI = async (value: string) => {
    await updateURI(value);
  };
  const signer = useSelector((state: RootState) => state.Info.userAddress);
  const deployer = import.meta.env.VITE_DEPLOYER;
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">NFT Smart Contract Manager</h1>
            <p className="text-muted-foreground text-lg">Manage Your NFT Collection </p>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              <a href="/nft/new">Add NFT</a>
            </Button>
            <Dialog>
              <DialogTrigger className="flex items-center gap-2 border border-amber-50 rounded-[10px] hover:bg-accent/10 bg-transparent p-2">
                <Settings className="mr-2 h-5 w-5" />
                Contract Configuration
              </DialogTrigger>
              <DialogContent className="m-w">
                <DialogHeader>
                  <DialogTitle className="flex gap-3">
                    <Settings className="mr-2 h-5 w-5" />
                    Contract Configuration
                  </DialogTitle>
                </DialogHeader>
                {signer === deployer && (
                  <div className="my-2">
                    <div className="flex gap-3 items-center">
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
                  </div>
                )}
                <DialogDescription className="text-green-500">This is the base URI where you store your NFT metadata</DialogDescription>
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
                  </div>
                </div>
                <DialogDescription className="text-green-500">Fill address you want to allow permission to manage NFT </DialogDescription>
                <div className="flex gap-3 items-center">
                  <span>Approval All</span>
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
                <DialogDescription className="text-green-500">Fill address you want to allow all permission to manage NFT </DialogDescription>
                <DialogFooter>
                  <DialogClose>Close</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mNFTs.map((nft, index) => (
          <NFTCard key={index} nft={nft} signer={signer} />
        ))}
      </div>
    </div>
  );
}
