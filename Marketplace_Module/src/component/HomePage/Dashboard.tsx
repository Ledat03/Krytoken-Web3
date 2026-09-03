import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, Sliders } from "lucide-react";
import NFTDetailDialog from "../common/Dialog";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import { useQueryOrderAdded, useQueryOrderMatched, useQueryLatestSoldData, useQueryMarketInfo } from "@/service/QueryService";
import type { IListOrder } from "@/redux/slice/sliceOrder";
import { LoadingLayout } from "../common/Loading";
import { ethers } from "ethers";
import { formatBalance } from "@/utils/common";
import { useInfiniteNFTs } from "@/hooks/useInfiniteNFTs";
import poster from "../../../public/background/poster-1.jpg";
import poster1 from "../../../public/background/poster-2.jpg";
import poster2 from "../../../public/background/poster-3.jpg";
import FilterPanel from "./FilterPanel";
import NFTGrid from "./NFTGrid";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "listed";

interface InfoListing {
  isActive: boolean;
  price: string;
}

const posters = [poster, poster1, poster2];

export default function Dashboard() {
  const { ListNFTs, NFTstatus, hasMore, loadMore, reset, isFetching } = useInfiniteNFTs();
  const { LoadingInfo, refetchMarketInfo } = useQueryMarketInfo();
  const { OrderAddedLoading, refetchOrderAdded } = useQueryOrderAdded();
  const { LoadingMatched, refetchOrderMatched } = useQueryOrderMatched();
  const { LatestSoldLoading, refetchLatestSold } = useQueryLatestSoldData();

  const onLoad = () => {
    reset();
    refetchMarketInfo();
    refetchOrderAdded();
    refetchOrderMatched();
    refetchLatestSold();
  };

  const isInitialLoading = (NFTstatus === "pending" && ListNFTs.length === 0) || LoadingInfo || OrderAddedLoading || LoadingMatched || LatestSoldLoading;
  const isLoadingMore = NFTstatus === "pending" && ListNFTs.length > 0;

  const OrderData: IListOrder = useSelector((state: RootState) => state.orderAdded);
  const signer = useSelector((state: RootState) => state.Info.userAddress);
  const infoMarket = useSelector((state: RootState) => state.marketInfo.feeUpdateds);
  const latestSold = useSelector((state: RootState) => state.LatestSoldData.latestSold);

  const [selectedClass, setSelectedClass] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 999999]);
  const [filter, setFilter] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTProperty | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const startAutoPlay = () => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posters.length);
    }, 3500);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, []);

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

  const toggleFilter = (f: string) => {
    setExpandedFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const openNFTDetail = (nft: NFTProperty) => {
    setSelectedNFT(nft);
    setIsDialogOpen(true);
  };

  const mapOfNFT = useMemo(() => {
    const map = new Map<string, InfoListing>();
    OrderData.listings?.forEach((item) => {
      const convertPrice = Number(ethers.formatUnits(String(item.price))).toFixed(0);
      map.set(String(item.tokenId), { isActive: item.isListing, price: convertPrice });
    });
    return map;
  }, [OrderData.listings]);

  const mapOfLatestSold = useMemo(() => {
    const map = new Map<number, string | undefined>();
    latestSold?.forEach((item) => {
      map.set(item.tokenId, formatBalance(item.lastSalePrice.toString()));
    });
    return map;
  }, [latestSold]);

  const maxPrice = useMemo(() => {
    let max = 0;
    mapOfNFT.forEach((val) => {
      const p = Number(val.price);
      if (p > max) max = p;
    });
    return max;
  }, [mapOfNFT]);

  const filteredSortedNFTs = useMemo(() => {
    const filtered = ListNFTs.filter((nft) => {
      const collectionMatch = selectedClass.length > 0 ? selectedClass.includes(nft.trait.class) : true;
      const rarityMatch = selectedRarity.length > 0 ? selectedRarity.includes(nft.trait.rarity) : true;
      const elementMatch = selectedElement.length > 0 ? selectedElement.includes(nft.trait.element) : true;
      const searchMatch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
      const listing = mapOfNFT.get(nft.tokenId.toString());
      const priceMatch = !listing?.isActive || (Number(listing.price) >= priceRange[0] && Number(listing.price) <= priceRange[1]);
      return collectionMatch && rarityMatch && elementMatch && searchMatch && priceMatch;
    });

    if (sortBy === "default") return filtered;
    return [...filtered].sort((a, b) => {
      const aListing = mapOfNFT.get(a.tokenId.toString());
      const bListing = mapOfNFT.get(b.tokenId.toString());
      const aPrice = aListing?.isActive ? Number(aListing.price) : null;
      const bPrice = bListing?.isActive ? Number(bListing.price) : null;

      if (sortBy === "price-asc") {
        if (aPrice === null && bPrice === null) return 0;
        if (aPrice === null) return 1;
        if (bPrice === null) return -1;
        return aPrice - bPrice;
      }
      if (sortBy === "price-desc") {
        if (aPrice === null && bPrice === null) return 0;
        if (aPrice === null) return 1;
        if (bPrice === null) return -1;
        return bPrice - aPrice;
      }
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "listed") {
        const aActive = aListing?.isActive ? 1 : 0;
        const bActive = bListing?.isActive ? 1 : 0;
        return bActive - aActive;
      }
      return 0;
    });
  }, [ListNFTs, selectedClass, selectedRarity, selectedElement, searchQuery, priceRange, sortBy, mapOfNFT]);

  return isInitialLoading ? (
    <div className="flex h-[100vh] w-[100vw] justify-center items-center bg-black">
      <LoadingLayout Loading={isInitialLoading} />
    </div>
  ) : (
    <div className="dark min-h-screen bg-background w-full">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-5 sm:px-6 lg:px-8">
          <div className="hidden sm:block relative overflow-hidden rounded-2xl select-none">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {posters.map((src, idx) => (
                <img key={idx} src={src} alt={`Poster ${idx + 1}`} className="w-full flex-shrink-0 object-cover rounded-2xl sm:h-[160px] md:h-[220px] lg:h-auto" draggable={false} />
              ))}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {posters.map((_, idx) => (
                <button key={idx} onClick={() => goToSlide(idx)} className={`transition-all duration-300 rounded-full ${idx === currentSlide ? "bg-white w-4 h-4 scale-110 shadow-lg" : "bg-white/50 w-3 h-3 hover:bg-white/80"}`} aria-label={`Go to slide ${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => setFilter(!filter)}
            title={filter ? "Hide filters" : "Show filters"}
            className={`flex items-center justify-center overflow-hidden bg-primary text-primary-foreground border border-primary hover:bg-primary/90 active:scale-95 transition-all duration-300 ease-in-out ${filter ? "w-36 h-10 rounded-xl gap-2 px-4" : "w-10 h-10 rounded-full"}`}
          >
            <Sliders className="h-4 w-4 flex-shrink-0" />
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${filter ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"}`}>Filter</span>
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="default">Default</option>
              <option value="listed">Listed First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </select>
          </div>
        </div>

        <div
          className="flex flex-col lg:grid items-start"
          style={{
            gridTemplateColumns: filter ? "256px 1fr" : "0px 1fr",
            columnGap: filter ? "24px" : "0px",
            transition: "grid-template-columns 300ms ease-in-out, column-gap 300ms ease-in-out",
          }}
        >
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out lg:max-h-none flex-shrink-0 w-full ${
              filter ? "max-h-[2000px] opacity-100 pb-4 lg:pb-0" : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="w-64 sticky top-8">
              <FilterPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedClass={selectedClass}
                onClassChange={setSelectedClass}
                selectedRarity={selectedRarity}
                onRarityChange={setSelectedRarity}
                selectedElement={selectedElement}
                onElementChange={setSelectedElement}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                maxPrice={maxPrice}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
              />
            </div>
          </div>

          <main className="min-w-0 w-full">
            <NFTGrid
              filteredNFTs={filteredSortedNFTs}
              mapOfNFT={mapOfNFT}
              latestSold={latestSold}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              observerRef={observerRef}
              onOpenNFTDetail={openNFTDetail}
              totalCount={ListNFTs.length}
            />
          </main>
        </div>
      </div>

      {isDialogOpen && selectedNFT && (
        <NFTDetailDialog nft={selectedNFT} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} signer={signer} feeRate={infoMarket} ListOrder={OrderData} latestSold={mapOfLatestSold.get(selectedNFT?.tokenId)} reload={onLoad} />
      )}
    </div>
  );
}
