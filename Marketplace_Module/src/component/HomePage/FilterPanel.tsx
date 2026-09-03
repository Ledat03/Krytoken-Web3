import { Check, ChevronDown, Search, Sliders } from "lucide-react";
import images from "@/utils/imageCustom";

const collections = ["Charge", "Ambush", "Support", "Defense", "Ranged", "Magic", "Healing", "Bomber"];
const rarities = ["Common", "Rare", "Epic", "Super_Epic", "Special", "Dragon", "Legendary", "Ancient", "Beast"];
const elements = ["Ice", "Darkness", "Earth", "Electricity", "Fire", "Grass", "Light", "Poison", "Steel", "Wind"];

const toggleValue = (arr: string[], value: string) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedClass: string[];
  onClassChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRarity: string[];
  onRarityChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedElement: string[];
  onElementChange: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  maxPrice: number;
  expandedFilters: string[];
  onToggleFilter: (filter: string) => void;
}

export default function FilterPanel({
  searchQuery,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedRarity,
  onRarityChange,
  selectedElement,
  onElementChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  expandedFilters,
  onToggleFilter,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search NFTs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => onToggleFilter("price")}
          className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Price Range (KYS)
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.includes("price") ? "rotate-180" : ""}`} />
        </button>
        {expandedFilters.includes("price") && (
          <div className="mt-4 space-y-3 relative">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Min</label>
                <input
                  type="number"
                  min={0}
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <span className="text-muted-foreground mt-4">—</span>
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Max</label>
                <input
                  type="number"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            {maxPrice > 0 && (
              <button onClick={() => onPriceRangeChange([0, maxPrice])} className="text-xs text-primary hover:underline border-2 w-13 h-6 rounded-2xl">
                Reset
              </button>
            )}
            <p className=" text-[15px] text-muted-foreground">Max listed price {maxPrice} KYS</p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => onToggleFilter("collection")}
          className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Class
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.includes("collection") ? "rotate-180" : ""}`} />
        </button>
        {expandedFilters.includes("collection") && (
          <div className="mt-4 flex flex-wrap gap-2">
            {collections.map((collection) => {
              const active = selectedClass.includes(collection);
              return (
                <button
                  key={collection}
                  onClick={() => onClassChange((prev) => toggleValue(prev, collection))}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${active ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/40" : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"}`}
                >
                  {active && <Check className="h-3 w-3" />}
                  {collection}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => onToggleFilter("rarity")}
          className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Rarity
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.includes("rarity") ? "rotate-180" : ""}`} />
        </button>
        {expandedFilters.includes("rarity") && (
          <div className="mt-4 space-y-1.5">
            {rarities.map((rarity) => {
              const active = selectedRarity.includes(rarity);
              return (
                <button
                  key={rarity}
                  onClick={() => onRarityChange((prev) => toggleValue(prev, rarity))}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 ${active ? "bg-primary/10 border-primary text-foreground" : "bg-background border-border hover:border-primary/50 hover:bg-muted/40"}`}
                >
                  <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${active ? "bg-primary border-primary" : "border-border"}`}>
                    {active && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                  </div>
                  <img src={images[rarity]} className="h-[25px] w-[130px] mx-auto" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <button
          onClick={() => onToggleFilter("element")}
          className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Element
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.includes("element") ? "rotate-180" : ""}`} />
        </button>
        {expandedFilters.includes("element") && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {elements.map((elem) => {
              const active = selectedElement.includes(elem);
              return (
                <button
                  key={elem}
                  onClick={() => onElementChange((prev) => toggleValue(prev, elem))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${active ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/30" : "bg-background border-border hover:border-primary/50 hover:bg-muted/40"}`}
                >
                  <img src={images[elem]} className="h-5 w-5 object-contain flex-shrink-0" />
                  <span className={`text-xs truncate ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{elem}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
