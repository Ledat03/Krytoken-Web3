import type { RefObject } from "react";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import images from "@/utils/imageCustom";
import { formatBalance } from "@/utils/common";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const PAGE_SIZE = 8;

interface InfoListing {
  isActive: boolean;
  price: string;
}

interface LatestSoldItem {
  tokenId: number;
  lastSalePrice: string | number;
}

interface NFTGridProps {
  filteredNFTs: NFTProperty[];
  mapOfNFT: Map<string, InfoListing>;
  latestSold: LatestSoldItem[];
  isLoadingMore: boolean;
  hasMore: boolean;
  observerRef: RefObject<HTMLDivElement | null>;
  onOpenNFTDetail: (nft: NFTProperty) => void;
  totalCount: number;
}

export default function NFTGrid({ filteredNFTs, mapOfNFT, latestSold, isLoadingMore, hasMore, observerRef, onOpenNFTDetail, totalCount }: NFTGridProps) {
  return (
    <>
      {filteredNFTs.length > 0 ? (
        <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNFTs.map((nft) => (
            <div
              key={nft.tokenId}
              onClick={() => onOpenNFTDetail(nft)}
              className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="relative h-50 w-full overflow-hidden bg-background">
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="h-full w-full object-cover transition-transform group-hover:scale-110 scale-90" />
                {mapOfNFT.get(nft.tokenId.toString())?.isActive && (
                  <div className="absolute left-2 top-2 text-[15px] text-green-400 flex items-center">
                    <GoDotFill className="animate-pulse-live" />
                    <span>Live</span>
                  </div>
                )}
                <div className="absolute right-2 top-2">
                  <img src={images[nft.trait.rarity]} alt="" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 cookie-text text-[18px]">{nft.name}</h3>
                <p className="text-xs text-muted-foreground"></p>
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  {mapOfNFT.get(nft.tokenId.toString())?.isActive ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-semibold text-primary">{mapOfNFT.get(nft.tokenId.toString())?.price} KYS</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-muted-foreground">Not Listed</span>
                    </div>
                  )}
                  <div>
                    {latestSold
                      .filter((item) => item.tokenId === nft.tokenId)
                      .map((item) => (
                        <div className="flex justify-between" key={item.tokenId}>
                          <span className="text-muted-foreground">Latest Sold</span>
                          <span className="font-semibold text-primary">{formatBalance(item.lastSalePrice.toString())} KYS</span>
                        </div>
                      ))}
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 gap-2">
                    <span className="flex mx-auto items-center gap-1 text-muted-foreground text-[13px]">
                      Click to see all detail <FaArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">No NFTs found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        </div>
      )}
      {isLoadingMore && (
        <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={`skeleton-${i}`} className="rounded-lg border border-border overflow-hidden w-full">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}
      {hasMore && <div ref={observerRef} className="h-10" />}
      {!hasMore && totalCount > 0 && <p className="text-center text-muted-foreground mt-2 pb-8">All NFTs loaded ({totalCount} total)</p>}
    </>
  );
}
