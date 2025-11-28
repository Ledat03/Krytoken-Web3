import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTCard from "./NFTCard";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useListNFTs } from "@/service/QueryService";
export default function NFTManager() {
  const { status, fillData } = useListNFTs();
  const mNFTs = useSelector((state: RootState) => state.InfoNFTs.ListNFTs);

  useEffect(() => {
    getListNFTs();
  }, [status]);

  const getListNFTs = async () => {
    await fillData();
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
            {signer === deployer && (
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Plus className="mr-2 h-5 w-5" />
                <a href="/nft/new">Add NFT</a>
              </Button>
            )}
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
