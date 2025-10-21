import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTCard from "./NFTCard";
import { useEffect, useState } from "react";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useListNFTs } from "@/service/QueryService";
export default function NFTManager() {
  const [newURI, setURI] = useState<string | null>("1");
  const { updateURI } = useNFTContract();
  const { status, fillData } = useListNFTs();
  const mNFTs = useSelector((state: RootState) => state.InfoNFTs.ListNFTs);
  console.log("Information Filled ", mNFTs);
  useEffect(() => {
    getListNFTs();
  }, [status]);
  const getListNFTs = async () => {
    await fillData();
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <input
          className="bg-amber-50 text-amber-950"
          type="text"
          onChange={(e) => {
            setURI(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (newURI) updateURI(newURI);
            console.log("updated");
          }}
        >
          {newURI}
        </button>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">NFT Smart Contract Manager</h1>
            <p className="text-muted-foreground text-lg">Manage Your NFT Collection </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              <a href="/nft/new">Add NFT</a>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-accent/10 bg-transparent">
              <Settings className="mr-2 h-5 w-5" />
              Cài đặt Contract
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Tổng NFT</p>
            <p className="text-2xl font-bold text-foreground">{mNFTs.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Tổng giá trị</p>
            <p className="text-2xl font-bold text-foreground">23.3 ETH</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Giá trung bình</p>
            <p className="text-2xl font-bold text-foreground">2.9 ETH</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Contract Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-lg font-semibold text-foreground">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mNFTs.map((nft, index) => (
          <NFTCard key={index} {...nft} />
        ))}
      </div>
    </div>
  );
}
