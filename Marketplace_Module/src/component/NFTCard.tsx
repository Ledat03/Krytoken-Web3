import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import images from "@/utils/imageCustom";
export default function NFTCard(nft: NFTProperty) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img src={nft.image} alt="image" className="object-cover group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-1 text-balance">{nft.name}</h3>
            <p className="text-xs text-muted-foreground">Token ID: #{nft.tokenId.toString().padStart(4, "0")}</p>
          </div>
          <div>
            <img src={images[nft.trait.rarity]} alt="" className="w-[100px]" />
          </div>
        </div>

        <div className="w-full flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Giá hiện tại</p>
            <p className="font-bold text-primary text-lg">10000</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">USD</p>
            <p className="font-semibold text-foreground">2000</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
