import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTCard from "./NFTCard";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { IListOrder } from "@/redux/slice/sliceOrder";
import type { RootState } from "@/redux/store";
import { useInfiniteNFTs } from "@/hooks/useInfiniteNFTs";
export default function NFTManager() {  
  const { ListNFTs,NFTstatus,hasMore,isFetching,loadMore} = useInfiniteNFTs();
  const signer = useSelector((state: RootState) => state.Info.userAddress);
  const deployer = import.meta.env.VITE_DEPLOYER;
  const isInitialLoading = (NFTstatus === "pending" && ListNFTs.length === 0);
  const isLoadingMore = NFTstatus === "pending" && ListNFTs.length > 0;
  const OrderData: IListOrder = useSelector((state: RootState) => state.orderAdded);
  const observerRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
    if (isInitialLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          loadMore();
        }
      },
      { threshold: 0.9 },
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, isFetching, loadMore, isInitialLoading]);
  console.log(ListNFTs)
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">NFT Smart Contract Manager</h1>
            <p className="text-muted-foreground text-lg cookie-text">Manage Your NFT Collection </p>
          </div>
          <div className="flex gap-3">
            {signer === deployer && (
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Plus className="mr-2 h-5 w-5" />
                <a className="cookie-text" href="/home/nft/new">Add NFT</a>
              </Button>
            )}
          </div>
        </div>
      </div>

     {ListNFTs.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ListNFTs.map((nft, index) => (
          <NFTCard key={index} nft={nft} signer={signer} listed={OrderData?.listings?.find((listing) => listing.owner?.toLowerCase() === signer?.toLowerCase() &&
    Number(listing.tokenId) === Number(nft.tokenId))}/>
        ))}
      </div> : <div className="cookie-text">
        Let's go to explore and buy some magic cookies !
      </div>
       }
       {hasMore && <div ref={observerRef} className="h-10" />}
    </div>
  );
}
