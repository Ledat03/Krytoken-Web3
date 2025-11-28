import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Sliders } from "lucide-react";
import NFTDetailDialog from "../common/Dialog";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import { queryOrderAdded, useListNFTs, queryOrderMatched } from "@/service/QueryService";
import images from "@/utils/imageCustom";
import { FaArrowRight } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { GoDotFill } from "react-icons/go";
import { queryMarketInfo } from "@/service/QueryService";
import type { IListOrderAdded } from "@/redux/slice/sliceOrder";
import { LoadingLayout } from "../common/Loading";
import { ethers } from "ethers";
const collections = ["Charge", "Ambush", "Support", "Defense", "Ranged", "Magic", "Healing", "Bomber"];
const rarities = ["Common", "Rare", "Epic", "Super_Epic", "Special", "Dragon", "Legendary", "Ancient", "Beast"];
const element = ["Ice", "Darkness", "Earth", "Electricity", "Fire", "Grass", "Light", "Poison", "Steel", "Wind"];
export default function Dashboard() {
  const { status, fillData } = useListNFTs();
  const {} = queryMarketInfo();
  const { OrderAddedStatus } = queryOrderAdded();
  const { StatusMatched } = queryOrderMatched();
  const [Loading, setLoading] = useState<boolean>(true);
  const OrderData: IListOrderAdded = useSelector((state: RootState) => state.orderAdded);
  const [selectedClass, setSelectedClass] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTProperty | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const NFTs: NFTProperty[] = useSelector((state: RootState) => state.InfoNFTs.ListNFTs);
  const signer = useSelector((state: RootState) => state.Info.userAddress);
  const infoMarket = useSelector((state: RootState) => state.marketInfo.feeUpdateds);
  interface InfoListing {
    isActive: string;
    price: string;
  }
  const getData = async () => {
    try {
      setLoading(true);
      await fillData();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [status, OrderAddedStatus, StatusMatched]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  const openNFTDetail = (nft: NFTProperty) => {
    setSelectedNFT(nft);
    setIsDialogOpen(true);
  };
  const mapOfNFT = useMemo(() => {
    const map = new Map<string, InfoListing>();
    OrderData.listings?.forEach((item) => {
      const convertPrice = Number(ethers.formatUnits(String(item.price))).toFixed(0);
      map.set(String(item.tokenId), { isActive: item.status, price: convertPrice });
    });
    return map;
  }, [OrderData.listings]);
  const filteredNFTs = NFTs.filter((nft) => {
    const collectionMatch = selectedClass.length > 0 ? selectedClass.includes(nft.trait.class) : nft;
    const rarityMatch = selectedRarity.length > 0 ? selectedRarity.includes(nft.trait.rarity) : nft;
    const elementMatch = selectedElement.length > 0 ? selectedElement.includes(nft.trait.element) : nft;
    // const priceMatch = nft.price >= priceRange[0] && nft.price <= priceRange[1];
    const searchMatch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
    return collectionMatch && rarityMatch && elementMatch && searchMatch;
  });
  const toggleValue = (filter: string[], value: string) => {
    return filter.includes(value) ? filter.filter((v) => v !== value) : [...filter, value];
  };
  return Loading ? (
    <div className="flex h-[100vh] w-[100vw] justify-center items-center bg-black">
      <LoadingLayout Loading={Loading} />
    </div>
  ) : (
    <>
      <div className="dark min-h-screen bg-background sm:w-[100%]">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Cookie Exclusive Collection</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{filteredNFTs.length} NFTs available</span>
              </div>
            </div>
          </div>
        </header>
        <div className=" lg:flex lg:relative sm:block justify-center">
          <div className="1max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <aside className="w-64 flex-shrink-0">
                <div className="sticky top-8 space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Search NFTs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <button onClick={() => toggleFilter("collection")} className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary">
                      <span className="flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Class
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedFilters.includes("collection") ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilters.includes("collection") && (
                      <div className="mt-4 space-y-2">
                        {collections.map((collection) => (
                          <label key={collection} className="flex items-center gap-2 cursor-pointer">
                            <Input
                              type="checkbox"
                              name="collection"
                              value={collection}
                              checked={selectedClass.includes(collection)}
                              onChange={(e) => {
                                setSelectedClass((prev) => toggleValue(prev, e.target.value));
                              }}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-foreground hover:text-primary">{collection}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <button onClick={() => toggleFilter("rarity")} className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary">
                      <span className="flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Rarity
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedFilters.includes("rarity") ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilters.includes("rarity") && (
                      <div className="mt-4 space-y-2">
                        {rarities.map((rarity) => (
                          <label key={rarity} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="rarity" value={rarity} checked={selectedRarity.includes(rarity)} onChange={(e) => setSelectedRarity((prev) => toggleValue(prev, e.target.value))} className="h-4 w-4 my-2 rounded border-border text-primary focus:ring-primary" />

                            <img src={images[rarity]} className="text-sm text-foreground hover:text-primary" />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <button onClick={() => toggleFilter("element")} className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary">
                      <span className="flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Element
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedFilters.includes("rarity") ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilters.includes("element") && (
                      <div className="mt-4 space-y-2">
                        {element.map((elem) => (
                          <label key={elem} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="rarity" value={elem} checked={selectedElement.includes(elem)} onChange={(e) => setSelectedElement((prev) => toggleValue(prev, e.target.value))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                            <img src={images[elem]} />
                            <span>{elem}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <button onClick={() => toggleFilter("price")} className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary">
                      <span className="flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Price Range
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedFilters.includes("price") ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilters.includes("price") && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Min Price (ETH)</label>
                          <input type="range" min="0" max="5" step="0.1" value={priceRange[0]} onChange={(e) => setPriceRange([Number.parseFloat(e.target.value), priceRange[1]])} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Max Price (ETH)</label>
                          <input type="range" min="0" max="5" step="0.1" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])} className="w-full" />
                        </div>
                        <div className="rounded bg-background p-2 text-center text-sm text-foreground">
                          {priceRange[0].toFixed(1)} - {priceRange[1].toFixed(1)} ETH
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <main className=" w-full sm:w-[500px] lg:w-[1000px]">
            {filteredNFTs.length > 0 ? (
              <div
                className="w-full grid grid-cols-1 gap-6 justify-items-stretch
                sm:grid-cols-2 sm:justify-items-center
                lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredNFTs.map((nft) => (
                  <div
                    key={nft.tokenId}
                    onClick={() => openNFTDetail(nft)}
                    className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20
                 w-full max-w-sm sm:max-w-none"
                  >
                    <div className="relative h-50 w-full overflow-hidden bg-background">
                      <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="h-full w-full object-cover transition-transform group-hover:scale-110 scale-90" />

                      {mapOfNFT.get(nft.tokenId.toString())?.isActive === "active" && (
                        <div className=" absolute left-2 top-2 text-[15px] text-green-400 flex items-center">
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
                      <p className="text-xs text-muted-foreground">{}</p>
                      <div className="mt-4 space-y-2 border-t border-border pt-4">
                        {mapOfNFT.get(nft.tokenId.toString())?.isActive === "active" ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Price</span>
                            <span className="font-semibold text-primary">{mapOfNFT.get(nft.tokenId.toString())?.price} KYS</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-muted-foreground">Not Listed</span>
                          </div>
                        )}
                        <div className="flex opacity-0 group-hover:opacity-100 gap-2">
                          <span className=" flex mx-auto items-center gap-1 text-muted-foreground text-[13px]">
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
          </main>
        </div>
        {isDialogOpen && <NFTDetailDialog nft={selectedNFT} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} signer={signer} feeRate={infoMarket} ListOrder={OrderData} />}
      </div>
    </>
  );
}
